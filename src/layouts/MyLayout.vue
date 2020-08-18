<template>
  <q-layout view="lHh Lpr lFf" v-if="$q.localStorage.has('studentData')">
    <q-resize-observer @resize="onResize" />
    <q-header reveal :reveal-offset="1" elevated>
      <q-toolbar class="bg5 q-pa-md color2">
        <div style="width:150px;"></div>
        <q-space />
        <q-toolbar-title v-if="innerWidth > 1000">
          <div align="center" class="text-h5">Winner O-NET</div>
        </q-toolbar-title>
        <q-space />
        <div>
          <q-btn @click="reload()" push icon="fas fa-sync-alt" class="bg7 q-mr-md"></q-btn>
          <q-btn @click="logout()" push icon="fas fa-sign-out-alt" class="bg11"></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <div
      class="fixed-top-left borders1-md borders-rb animated fadeInLeft"
      style="z-index:5000;"
      :class="{'bar-main':innerWidth > 500,'bar-main-half':innerWidth < 501}"
    >
      <div class="bg8" style="border-radius:0px 0px 7px 7px">
        <div class="row">
          <div
            class="col-12 bg1 text-white q-pr-sm text-body1 relative-position"
            align="right"
            style="padding:0px 10px;"
          >
            <div>
              <span v-if="innerWidth > 500">LEVEL {{level}}</span>
              <span v-else>LV.{{level}}</span>
            </div>
            <div class="absolute-bottom-left bar-exp-bottom">
              <div align="center" class="absolute-center full-width" style="top:-11px;">
                <span class="q-pl-xs">XP {{(currentExp % exp) + "/" + exp }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-linear-progress :value="progress" color="warning" class="bar-exp" />
          </div>
        </div>
        <div class="row">
          <div
            class="q-pt-md q-pb-sm"
            :class="{'col-4':innerWidth > 500,'col-12':innerWidth < 501}"
            align="center"
          >
            <q-img
              v-if="level < 25"
              :src="'../statics/images/Level' + level + '.png'"
              style="width:50px;"
            />
            <q-img
              v-if="level > 24"
              :src="'../statics/images/Level' + level + '.png'"
              style="width:70px;"
            />
          </div>
          <div class="col self-center q-px-xs" v-if="innerWidth > 500" align="center">
            <span class="text-h6">{{student.name}}</span>
          </div>
        </div>
      </div>
    </div>

    <q-page-container v-if="$q.localStorage.has('studentData')">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { db } from "../router/index.js";
import Axios from "axios";
export default {
  name: "MyLayout",

  data() {
    return {
      progress: 0,
      currentExp: 0,
      exp: 30,
      level: "1",
      student: this.$q.localStorage.getItem("studentData"),
      innerWidth: window.InnerWidth,
      innerHeight: window.InnerHeight
    };
  },
  methods: {
    reload() {
      window.location.reload();
    },
    async checkStudentLogin() {
      let studentLoginKey = this.$q.localStorage.getItem("studentLoginKey");

      this.snapStudentLogin = await db
        .collection("Student")
        .doc(this.student.key)
        .onSnapshot({ includeMetadataChanges: true }, data => {
          if (data.data().loginKey != studentLoginKey) {
            this.notifyRed("มีการเข้าใช้งานจากอุปกรณ์อื่น");
            if (this.dataSnapshot) {
              this.dataSnapshot();
            }
            this.snapStudentLogin();
            this.snapMain();
            this.snapExp();
            this.$q.localStorage.clear();
            this.$router.push("/");
          }
        });
    },
    async loadSync() {
      let studentLoginKey = this.$q.localStorage.getItem("studentLoginKey");

      let time = await this.getTime();
      let studentTime = this.$q.localStorage.getItem("studentTime");

      if (time.microtime - studentTime > 2700000) {
        this.$q.localStorage.clear();
        this.$router.push("/");
      }

      this.snapMain = db
        .collection("Synchronize")
        .where("academicKey", "==", this.student.year)
        .where("currentTeachRoom", "==", this.student.room)
        .where("schoolcode", "==", this.student.schoolCode)
        .where("status", "==", "login")
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          if (doc.size > 0) {
            let currentTime =
              time.microtime - doc.docs[0].data().activetime.microtime;

            if (currentTime > 1800000) {
              if (this.$route.name != "studentWaiting") {
                this.$router.push("/student/waiting/");
              }
            } else {
              this.$q.localStorage.set("studentTime", time.microtime);
              this.$q.localStorage.set("section", doc.docs[0].data().section);

              this.$q.localStorage.set(
                "answerArr",
                doc.docs[0].data().answerArr
              );
              this.$q.localStorage.set(
                "practiceType",
                doc.docs[0].data().studyplanType
              );

              this.$q.localStorage.set("teacherRoomKey", doc.docs[0].id);

              this.$q.localStorage.set(
                "practiceKey",
                doc.docs[0].data().studyplanKey
              );

              if (doc.docs[0].data().studyplanKey == "studyplan") {
                if (this.$route.name != "studentWaitingSection") {
                  this.$router.push("/student/waiting/section/");
                }

                db.collection("Student")
                  .doc(this.student.key)
                  .update({
                    status: "online"
                  });
              } else {
                if (doc.docs[0].data().studyplanType == "กระดาษคำตอบ") {
                  if (this.$route.name != "studentAnswerSheet") {
                    this.$router.push("/student/answersheet/");
                  }
                } else if (doc.docs[0].data().studyplanType == "เฉลยการบ้าน") {
                  if (this.$route.name != "studentAnswer") {
                    this.$router.push("/student/answer/");
                  }
                } else if (doc.docs[0].data().studyplanType == "สรุป") {
                  if (this.$route.name != "studentScore") {
                    this.$router.push("/student/score/");
                  }
                } else if (doc.docs[0].data().studyplanType == "VDO") {
                  if (this.$route.name != "studentVideo") {
                    this.$router.push("/student/vdo/");
                  }
                } else if (doc.docs[0].data().studyplanType == "แบบฝึกหัด") {
                  if (this.$route.name != "studentPracticeKahoot") {
                    this.$router.push("/student/practice/");
                  }
                } else if (doc.docs[0].data().studyplanType == "แบบทดสอบ") {
                  if (this.$route.name != "studentTest") {
                    this.$router.push("/student/test/");
                  }
                } else if (doc.docs[0].data().studyplanType == "ข้อสอบ") {
                  if (this.$route.name != "studentExam") {
                    this.$router.push("/student/exam/");
                  }
                } else if (doc.docs[0].data().studyplanType == "เฉลยข้อสอบ") {
                  if (this.$route.name != "studentExamAnswer") {
                    this.$router.push("/student/examanswer/");
                  }
                } else if (doc.docs[0].data().studyplanType == "showScore") {
                  if (this.$route.name != "studentReportScore") {
                    this.$router.push("/student/report/");
                  }
                } else if (doc.docs[0].data().studyplanType == "rankingtop3") {
                  if (this.$route.name != "studentScore") {
                    this.$router.push("/student/score/");
                  }
                }
              }
            }
          } else {
            db.collection("Student")
              .doc(this.student.key)
              .update({
                status: "logout"
              })
              .then(() => {
                this.notifyGreen("จบคาบเรียนแล้ว");

                if (this.dataSnapshot) {
                  this.dataSnapshot();
                }
                this.snapStudentLogin();
                this.snapMain();
                this.snapExp();
                this.$q.localStorage.clear();
                this.$router.push("/");
                return;
              });
          }
        });
    },
    async loadStudentExp() {
      this.snapExp = db
        .collection("studentScoreLog")
        .where("studentKey", "==", this.student.key)
        .where("academicKey", "==", this.student.year)
        .where("room", "==", this.student.room)
        .where("checkScore", "==", true)
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          this.currentExp = 0;
          this.progress = 0;
          this.level = "1";
          if (doc.size > 0) {
            doc.forEach(data => {
              let dataList = data.data().dataAnswerList;
              for (let i = 0; i < dataList.length; i++) {
                if (dataList[i].status == "ถูก") {
                  this.currentExp += 1;
                }
              }
            });
            this.level = Math.floor(this.currentExp / this.exp + 1);
            this.progress = (this.currentExp % this.exp) / this.exp;
          }
        });
    },
    onResize(size) {
      (this.innerWidth = size.width), (this.innerHeight = size.height);
    }
  },
  mounted() {
    this.checkPlatForm();

    let studentLocal = this.$q.localStorage.has("studentData");

    if (studentLocal) {
      this.checkStudentLogin();
      this.loadSync();
      this.loadStudentExp();
      this.loadVersion();
    } else {
      this.$q.localStorage.clear();
      this.$router.push("/");
    }
  }
};
</script>


<style scoped>
.bar-main {
  width: 300px;
  border-top: 0px solid transparent;
}
.bar-main-half {
  width: 50%;
  border-top: 0px solid transparent;
}
.bar-exp {
  background-color: #ada4a8;
  height: 9px;
  width: 100%;
}
.bar-exp-bottom {
  border-top: 25px solid #0a9e9c;
  border-right: 15px solid transparent;
  width: 100px;
  font-size: 13px;
}

.animated {
  animation-duration: 0.7s;
}
</style>