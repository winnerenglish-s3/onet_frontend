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
        <div class="col-12 q-pt-lg" align="center">
          <q-icon name="fas fa-user-circle" class="color1" size="80px"></q-icon>
        </div>
        <div class="col-12 q-pt-md" align="center">
          <span class="text-h6" v-if="student">{{student.name}}</span>
          <span class="text-h6" v-if="teacher">{{teacher.name}}</span>
        </div>
        <div class="q-px-md-xl q-px-xs-lg col-12 q-pt-md" align="center">
          <q-btn
            class="bg5 text-white"
            label="เข้าสู่ระบบ"
            style="width:100%"
            @click="toContinue()"
          />
        </div>
        <div class="col-12 q-mt-sm" align="center">
          <span
            @click="logout()"
            class="text-underline cursor-pointer"
          >เข้าสู่ระบบด้วยบัญชีผู้ใช้อื่น</span>
        </div>
        <div align="right" class="q-px-md col-12 q-pb-sm color1">V{{ version }}</div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      student: {},
      teacher: {}
    };
  },
  methods: {
    toContinue() {
      let userType = this.$q.localStorage.getItem("userType");
      if (userType == "student") {
        this.$router.push("/student/waiting");
      } else {
        this.$router.push("/teacherMenuSelection");
      }
    }
  },
  mounted() {
    this.checkPlatForm();
    let studentData = this.$q.localStorage.getItem("studentData");
    let teacherData = this.$q.localStorage.getItem("teacherData");
    if (!studentData && !teacherData) {
      this.$router.push("/");
    } else {
      studentData == null
        ? (this.teacher = teacherData)
        : (this.student = studentData);
    }
  }
};
</script>

<style scoped >
.box1 {
  background-color: #f48f84;
  border-radius: 10px;
}
.text-underline {
  text-decoration: underline;
}
.box2 {
  background-color: #fce0c7;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>