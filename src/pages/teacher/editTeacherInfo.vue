<template>
  <div>
    <teacher-bar
      :isShowBackBtn="true"
      :backtopagename="this.$q.localStorage.getItem('previousPage')"
    ></teacher-bar>
    <div class="flex flex-center animated fadeIn" style="height:calc(100vh - 70px)">
      <div class="row fit justify-center items-center">
        <div class="col-6 bg-8">
          <!-- IMG HEADER -->
          <div class="text-center bg-transparent relative-position" style="bottom:-15px">
            <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
            <div class="absolute-full flex flex-center">
              <span class="color1 text-h4">แก้ไขผู้ใช้งาน</span>
            </div>
          </div>

          <div
            class="bg9 q-py-lg"
            style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
          >
            <div class="q-px-xl q-py-lg q-gutter-md">
              <div>
                <q-input
                  v-model="objData.name"
                  label="ชื่อ"
                  class="q-pl-md bg-white"
                  style="border:1px solid#353535;border-radius:5px"
                  borderless
                />
              </div>
              <div>
                <q-input
                  v-model="objData.surname"
                  label="นามสกุล"
                  class="q-pl-md bg-white"
                  style="border:1px solid#353535;border-radius:5px"
                  borderless
                />
              </div>
              <div>
                <q-input
                  v-model="objData.tel"
                  label="เบอร์โทรศัพท์"
                  mask="###-###-####"
                  class="q-pl-md bg-white"
                  style="border:1px solid#353535;border-radius:5px"
                  borderless
                />
              </div>
              <div>
                <q-input
                  v-model="objData.password"
                  label="รหัสผ่าน"
                  class="q-pl-md bg-white"
                  style="border:1px solid#353535;border-radius:5px"
                  borderless
                />
              </div>
            </div>

            <div class="q-gutter-md" align="center">
              <q-btn style="width:200px" label="ยกเลิก" push class="bg2" @click="cancleEdit()"></q-btn>
              <q-btn @click="editInfo()" style="width:200px" class="bg5 color2" label="บันทึก" push></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../router/index.js";
import teacherBar from "../../components/teacherappbar.vue";
export default {
  components: {
    teacherBar
  },
  data() {
    return {
      teacherData: this.$q.localStorage.getItem("teacherData"),
      objData: {
        name: this.$q.localStorage.getItem("teacherData").name,
        surname: this.$q.localStorage.getItem("teacherData").surname,
        password: this.$q.localStorage.getItem("teacherData").password,
        tel: this.$q.localStorage.getItem("teacherData").tel,
        key: this.$q.localStorage.getItem("teacherData").key,
        school: this.$q.localStorage.getItem("teacherData").school
      }
    };
  },
  methods: {
    cancleEdit() {
      this.$router.push("/teacherStudyplan");
    },
    editInfo() {
      this.showLoading();
      this.objData.tel = this.objData.tel.replace(/-/g, "");

      if (
        this.$q.localStorage.getItem("teacherData").tel.replace(/-/g, "") ==
        this.objData.tel
      ) {
        // กรณีไม่เปลี่ยนแปลง Username
        db.collection("Teacher")
          .doc(this.$q.localStorage.getItem("teacherData").key)
          .update(this.objData)
          .then(res => {
            this.hideLoading();
            this.$q.notify({
              message: "บันทึกข้อมูลสำเร็จ",
              color: "teal",
              position: "top"
            });
            this.$q.localStorage.set("teacherData", this.objData);
          });
      } else {
        db.collection("Teacher")
          .where("tel", "==", this.objData.tel)
          .get()
          .then(doc => {
            if (doc.size) {
              // กรณี Username ซ้ำ
              this.hideLoading();
              this.$q.dialog({
                title: "ผิดพลาด",
                message: "มี Username นี้แล้วในระบบ"
              });
            } else {
              db.collection("Teacher")
                .doc(this.$q.localStorage.getItem("teacherData").key)
                .update(this.objData)
                .then(res => {
                  this.hideLoading();
                  this.$q.notify({
                    message: "บันทึกข้อมูลสำเร็จ",
                    color: "teal",
                    position: "top"
                  });
                  this.$q.localStorage.set("teacherData", this.objData);
                });
            }
          });
      }
    }
  },
  mounted() {
    this.checkTeacherPermission();
  }
};
</script>

<style lang="scss" scoped>
</style>