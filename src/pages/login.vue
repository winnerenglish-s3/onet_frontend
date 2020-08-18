<template>
  <div class="row justify-center items-center window-height q-px-sm">
    <div class="col-12 q-mb-md" style="max-width:400px;width:100%;">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../statics/bar login.png" style="width:100%" />
        <div class="absolute-center q-pa-md" style="width:100%;max-width:300px;">
          <img src="../statics/images/WO.png" style="width:100%;" />
        </div>
      </div>

      <div class="box2 row" style="border:3px solid #333D49">
        <div class="col-12 q-px-xl q-pt-xl">
          <q-input
            v-model="username"
            mask="##########"
            label="ชื่อผู้ใช้งาน"
            class="q-pl-md bg-white"
            style="border:1px solid#353535;border-radius:5px"
            borderless
          />
        </div>
        <div class="col-12 q-px-xl q-pt-lg">
          <q-input
            :type="isPwd ? 'password' : 'text'"
            class="q-pl-md bg-white"
            style="border:1px solid#353535;border-radius:5px"
            v-model="password"
            label="รหัสผ่าน"
            borderless
            @keyup.enter="login()"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer q-pr-md"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12 q-px-xl q-pt-lg">
          <div class="row">
            <div class="col-6">
              <q-radio color="secondary" v-model="loginMode" val="1" label="คุณครู" class="color1" />
            </div>
            <div class="col-6">
              <q-radio
                color="secondary"
                v-model="loginMode"
                val="2"
                label="นักเรียน"
                class="color1"
              />
            </div>
          </div>
        </div>

        <div class="q-px-xl q-pb-lg col-12 q-pt-lg" align="center">
          <q-btn class="bg5 text-white" label="เข้าสู่ระบบ" style="width:100%" @click="login()" />
        </div>
        <div align="right" class="q-px-md col-12 q-pb-sm">V{{ version }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      isPwd: true,
      username: "",
      password: "",
      loginMode: "2"
    };
  },
  methods: {
    async login() {
      this.showLoading();
      let microTime = await this.getTime();
      if (this.loginMode == "1") {
        // ******************* ล็อคอินคุณครู *******************
        db.collection("Teacher")
          .where("tel", "==", this.username)
          .where("password", "==", this.password)
          .get()
          .then(doc => {
            if (doc.size) {
              let loginKey = Math.random()
                .toString(36)
                .substr(2);

              db.collection("Teacher")
                .doc(doc.docs[0].id)
                .update({
                  loginKey: loginKey
                })
                .then(() => {
                  this.$q.localStorage.set("teacherLoginKey", loginKey);

                  db.collection("Synchronize")
                    .doc(doc.docs[0].id)
                    .update({ status: "logout" })
                    .then(() => {
                      // กรณีพบ Username ของคุณครู
                      db.collection("Synchronize")
                        .doc(doc.docs[0].id)
                        .set({
                          activetime: microTime,
                          currentTeachRoom: "",
                          studyplanKey: "Login",
                          schoolcode: doc.docs[0].data().school,
                          status: "login"
                        })
                        .then(async () => {
                          let teacherData = {
                            key: doc.docs[0].id
                          };
                          let teacherDataFinal = {
                            ...teacherData,
                            ...doc.docs[0].data()
                          };

                          this.hideLoading();
                          this.$q.localStorage.set(
                            "teacherData",
                            teacherDataFinal
                          );
                          this.$q.localStorage.set("userType", "teacher");
                          this.$router.push("/teacherMenuSelection");
                        });
                    })
                    .catch(err => {
                      db.collection("Synchronize")
                        .doc(doc.docs[0].id)
                        .set({
                          activetime: microTime,
                          currentTeachRoom: "",
                          studyplanKey: "Login",
                          schoolcode: doc.docs[0].data().school,
                          status: "login"
                        })
                        .then(async () => {
                          let teacherData = {
                            key: doc.docs[0].id
                          };
                          let teacherDataFinal = {
                            ...teacherData,
                            ...doc.docs[0].data()
                          };

                          this.hideLoading();
                          this.$q.localStorage.set(
                            "teacherData",
                            teacherDataFinal
                          );
                          this.$q.localStorage.set("userType", "teacher");
                          this.$router.push("/teacherMenuSelection");
                        });
                    });
                });
            } else {
              // Username or Password ผิดพลาด
              this.hideLoading();
              this.$q.dialog({
                title: "ผิดพลาด",
                message: "ไม่พบรหัสผู้ใช้งานในระบบ"
              });
            }
          });
      } else {
        // ล็อคอินนักเรียน
        let extractSchoolCode = this.username.slice(0, 3);
        let schoolCode;
        schoolCode = await db
          .collection("School")
          .where("schoolCode", "==", Number(extractSchoolCode))
          .get();
        if (schoolCode.size > 0) {
          // มีรหัสโรงเรียนนี้ในระบบ
          let checkUserPassword = await db
            .collection("Student")
            .where("studentId", "==", this.username.slice(3))
            .where("password", "==", this.password)
            .get();
          if (checkUserPassword.size) {
            let checkTeacherOnline = await db
              .collection("Synchronize")
              .where("academicKey", "==", checkUserPassword.docs[0].data().year)
              .where(
                "currentTeachRoom",
                "==",
                checkUserPassword.docs[0].data().room
              )
              .where(
                "schoolcode",
                "==",
                checkUserPassword.docs[0].data().schoolCode
              )
              .where("status", "==", "login")
              .get();

            if (checkTeacherOnline.size == 0) {
              this.notifyRed("กรุณารอคุณครูเข้าสู่ระบบก่อนเข้าใช้งาน");
              this.hideLoading();
              return;
            }

            // Username และ Password ถูกต้อง
            let loginKey = Math.random()
              .toString(36)
              .substr(2);

            db.collection("Student")
              .doc(checkUserPassword.docs[0].id)
              .update({
                loginKey: loginKey,
                time: microTime,
                status: "online"
              })
              .then(() => {
                this.$q.localStorage.set("studentLoginKey", loginKey);
                this.$q.localStorage.set("studentTime", microTime.microtime);
                let studentKey = { key: checkUserPassword.docs[0].id };
                let dataFinal = {
                  ...studentKey,
                  ...checkUserPassword.docs[0].data()
                };

                this.$q.localStorage.set("studentData", dataFinal);
                this.$q.localStorage.set("userType", "student");
                this.$router.push("/student/waiting");
                this.hideLoading();
              });
          } else {
            // Username / Password ผิดพลาด
            this.hideLoading();
            this.$q.dialog({
              title: "ผิดพลาด",
              message: "ไม่พบรหัสผู้ใช้งานนี้ในระบบ"
            });
          }
        } else {
          // ไม่พบ รหัสโรงเรียนนี้ในระบบ
          this.hideLoading();
          this.$q.dialog({
            title: "ผิดพลาด",
            message: "ไม่พบรหัสผู้ใช้งานนี้ในระบบ"
          });
        }
      }
    }
  },
  mounted() {
    this.checkPlatForm();
    this.$q.localStorage.clear();
  }
};
</script>

<style scoped >
.box1 {
  background-color: #f48f84;
  border-radius: 10px;
}
.box2 {
  background-color: #fce0c7;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>