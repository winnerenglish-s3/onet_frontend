<template>
  <div>
    <teacher-bar
      :isShowBackBtn="true"
      @testFunc="clearIntervalFunc()"
      :backtopagename="'/teacherStudyplan'"
    ></teacher-bar>
    <div class="maindiv" style="margin:auto">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">กระดาษคำตอบ</div>
      </div>
      <!-- Content -->
      <div
        class="bg8 q-py-lg q-pa-xs-sm q-pa-md-xl"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <!-- นาฬิกา -->
        <div class="row justify-center" align="center">
          <div
            class="col-11 bg-white q-pa-xl text-h1"
            style="border:2px solid black;border-radius:10px"
          >
            <span v-show="!showTimeoutText">
              <q-icon name="far fa-clock" style="position:relative;top:-10px" />
              <span style="font-family:Timer" class="q-pl-md">{{minutes}} : {{seconds}}</span>
            </span>

            <span
              v-show="showTimeoutText"
              class="text-red animated flash infinite"
              style="animation-duration:1.5s"
            >หมดเวลา</span>
          </div>
        </div>

        <div class="row justify-center q-pt-xl" align="center">
          <div
            class="col-11 bg-white q-px-xl text-h3 q-py-md"
            style="border:2px solid black;border-radius:10px"
          >
            จำนวนนักเรียนที่ทำเสร็จ
            <q-icon name="far fa-user" class="q-pr-md q-pb-xs" />
            {{ totalFinishStudent }} / {{ totalOnlineStudent }}
          </div>
        </div>

        <div align="center" class="q-pt-xl">
          <q-btn
            @click="finishTeaching()"
            push
            label="เสร็จสิ้น"
            style="width:300px"
            class="bg5 color2"
          ></q-btn>
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
      timer: this.$q.localStorage.getItem("countdownTime"),
      minutes: null,
      seconds: null,
      totalStudent: 0,
      totalFinishStudent: 0,
      classroom: this.$q.localStorage.getItem("classroomSelected"),
      teacherData: this.$q.localStorage.getItem("teacherData"),
      showTimeoutText: false,
      myInterval: null,
      finishStudentSnapshot: "",
      totalOnlineStudent: 0
    };
  },
  methods: {
    clearIntervalFunc() {
      clearInterval(this.myInterval);
      this.onlineStudentSnapshot();
    },
    async finishTeaching() {
      this.clearIntervalFunc();
      let getTime = await this.getTime();
      let academicKey = await this.getAcademicYear();

      db.collection("StudyplanReportLog")
        .add({
          schoolKey: this.teacherData.school,
          time: getTime,
          practicekey: this.$route.params.practicekey,
          teacherKey: this.teacherData.key,
          academicKey: academicKey,
          classroom: this.$q.localStorage.getItem("classroomSelected"),
          section: this.$q.localStorage.getItem("currentSectionNumber"),
          microtime: getTime.microtime,
          practiceType: this.$q.localStorage.getItem("practiceType")
        })
        .then(() => {
          db.collection("TeacherStudyplanLog")
            .where("practiceKey", "==", this.$route.params.practicekey)
            .where("teacherKey", "==", this.teacherData.key)
            .where("academicKey", "==", academicKey)
            .get()
            .then(teacherCheck => {
              if (teacherCheck.size == 0) {
                db.collection("TeacherStudyplanLog")
                  .add({
                    status: true,
                    time: getTime,
                    practiceKey: this.$route.params.practicekey,
                    teacherKey: this.teacherData.key,
                    academicKey: academicKey
                  })
                  .then(() => {
                    this.$router.push("/teacherStudyplan");
                  });
              } else {
                this.$router.push("/teacherStudyplan");
              }
            });
        });
    },
    getFinishStudent() {
      this.finishStudentSnapshot = db
        .collection("studentScoreLog")
        .where("practiceKey", "==", this.$route.params.practicekey)
        .where("schoolCode", "==", this.teacherData.school)
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          let temp = 0;
          doc.forEach(element => {
            if (element.data().status == true) {
              temp++;
            }
          });
          this.totalFinishStudent = temp;
        });
    },
    async getOnlineStudent() {
      let academicKey = await this.getAcademicYear();

      this.onlineStudentSnapshot = db
        .collection("Student")
        .where("room", "==", this.$q.localStorage.getItem("classroomSelected"))
        .where("schoolCode", "==", this.teacherData.school)
        .where("status", "==", "online")
        .where("year", "==", academicKey)
        .onSnapshot(doc => {
          this.totalOnlineStudent = doc.size;
        });
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.minutes = this.$q.localStorage.getItem("minutes");
    this.seconds = this.$q.localStorage.getItem("seconds");
    this.myInterval = setInterval(() => {
      if (this.minutes < 0) {
        // หมดเวลา
        this.showTimeoutText = true;
        clearInterval(this.myInterval);
      } else {
        if (this.seconds == 0) {
          this.seconds = 59;
          let newMinutes = (this.minutes -= 1);
          this.$q.localStorage.set("minutes", newMinutes);
          this.$q.localStorage.set("seconds", 59);
          this.minutes = this.$q.localStorage.getItem("minutes");
          this.seconds = this.$q.localStorage.getItem("seconds");
        } else {
          let newSeconds = Number((this.seconds -= 1));
          this.$q.localStorage.set("seconds", newSeconds);
          this.seconds =
            this.$q.localStorage.getItem("seconds") < 10
              ? "0" + this.$q.localStorage.getItem("seconds")
              : this.$q.localStorage.getItem("seconds");
        }
      }
    }, 1000);
    let _this = this;
    window.onpopstate = function() {
      this.finishStudentSnapshot();
      clearInterval(_this.myInterval);
      this.onlineStudentSnapshot();
    };
    this.getFinishStudent();
    this.getOnlineStudent();
  }
};
</script>

<style>
.duration-flash {
  animation-duration: 2s;
}
</style>