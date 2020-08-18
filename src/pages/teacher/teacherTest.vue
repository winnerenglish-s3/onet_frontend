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
        <div class="absolute-full flex flex-center color1 text-h6">แบบทดสอบ</div>
      </div>
      <!-- Content -->
      <div
        class="bg8 q-py-lg q-pa-xs-xs q-pa-md-xl"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div class="row items-center reverse-wrap q-pt-xs-lg">
          <div class="col-md-8 col-xs-12 q-pt-xs-lg">
            <div class="text-h5" align="center">{{ sectionName }}</div>
          </div>
          <div class="col-md-4 col-xs-12 row justify-end">
            <!-- CLOCK -->
            <div
              style="width:120px;border-radius:10px;border:2px solid #353535 "
              class="q-pa-sm text-h6 bg-white q-mr-md"
              align="center"
            >
              <span v-show="!showTimeoutText">
                <q-icon class="far fa-clock" />
                {{ minutes }} : {{ seconds }}
              </span>
              <span
                v-show="showTimeoutText"
                class="animated flash infinite color11"
                style="animation-duration:1.5s"
              >หมดเวลา</span>
            </div>
            <!-- จำนวนคน -->
            <div
              style="width:120px;border-radius:10px;border:2px solid #353535 "
              class="q-pa-sm text-h6 bg-white"
              align="center"
            >
              <span>
                <q-icon name="far fa-clock" class="q-pr-md q-pb-xs" />
                {{ finishStudent }} / {{ totalOnlineStudent }}
              </span>
            </div>
          </div>
        </div>
        <!-- TABLE HEADER -->
        <div class="row q-pt-xl text-h6 q-pa-sm">
          <div class="col-md-1 col-xs-3 text-h5" align="center">
            เลขที่
            <q-icon name="fas fa-sort" class="cursor-pointer" @click="sortNumber()"></q-icon>
          </div>
          <div class="col-md-5 col-xs-5 text-h5" align="center">ชื่อ - นามสกุล</div>
          <div class="col-md-6 col-xs-4 text-h5" align="center">
            จำนวนข้อ
            <q-icon @click="sortAnswer()" name="fas fa-sort" class="cursor-pointer"></q-icon>
          </div>
        </div>

        <!-- TABLE CONTENT -->
        <div class="row text-h6 q-pa-sm" v-for="(item,index) in testData" :key="index">
          <div class="col-md-1 col-xs-3 q-px-sm" align="center">
            <div class="q-pa-sm bg9 fit">{{ item.studentNo }}</div>
          </div>
          <div class="col-md-5 col-xs-5 q-px-sm">
            <div class="q-pl-xl bg9 q-pa-sm fit">{{ item.studentName }}</div>
          </div>
          <div class="col-md-6 col-xs-4 q-px-sm">
            <div class="row q-pa-sm bg9 fit">
              <div
                class="col-xs-3 col-md bg9 border-number"
                :class="{'border-left' : i == 1}"
                v-for="i in totalQuestion"
                :key="i"
              >
                <span v-if="item.dataAnswerList[i-1] != undefined">
                  <div
                    align="center"
                    :class="{'bg5 color2' : item.dataAnswerList[i-1].answer != 0,'bg7 color' : item.currentQuestion == i-1,'bg2 color1' : item.dataAnswerList[i-1].answer == 0}"
                  >{{ i }}</div>
                </span>
                <span v-else>
                  <div
                    align="center"
                    :class="{'bg2 color1' : item.currentQuestion != i-1,'bg7' : item.currentQuestion == i-1}"
                  >{{ i }}</div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div align="center" class="q-pt-xl">
          <q-btn
            label="เสร็จสิ้น"
            push
            style="width:250px"
            class="bg5 color2"
            @click="finishTest()"
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
      minutes: 0,
      seconds: 0,
      showTimeoutText: false,
      finishStudent: 0,
      totalStudent: 0,
      sectionName: this.$q.localStorage.getItem("sectionName"),
      testData: [],
      teacherData: this.$q.localStorage.getItem("teacherData"),
      sortAnswerType: "ASC",
      totalQuestion: 0,
      timeInterval: null,
      sortNumberType: "ASC",
      totalOnlineStudent: 0
    };
  },
  methods: {
    clearIntervalFunc() {
      clearInterval(this.timeInterval);
      this.onlineStudentSnapshot();
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
    },
    async finishTest() {
      this.showLoading();
      this.clearIntervalFunc();
      let academicKey = await this.getAcademicYear();
      this.$q.localStorage.set("showAnswerType", "สรุปผลคะแนน");
      let getTime = await this.getTime();

      db.collection("StudyplanReportLog")
        .add({
          schoolKey: this.teacherData.school,
          time: getTime,
          practicekey: this.$route.params.key,
          teacherKey: this.teacherData.key,
          academicKey: academicKey,
          classroom: this.$q.localStorage.getItem("classroomSelected"),
          section: this.$q.localStorage.getItem("currentSectionNumber"),
          microtime: getTime.microtime,
          practiceType: "แบบทดสอบ"
        })
        .then(() => {
          db.collection("TeacherStudyplanLog")
            .where("practiceKey", "==", this.$route.params.key)
            .where("teacherKey", "==", this.teacherData.key)
            .where("academicKey", "==", academicKey)
            .get()
            .then(checkSize => {
              if (checkSize.size == 0) {
                db.collection("Synchronize")
                  .doc(this.teacherData.key)
                  .update({ studyplanType: "สรุป" })
                  .then(() => {
                    db.collection("TeacherStudyplanLog")
                      .add({
                        status: true,
                        time: getTime,
                        practiceKey: this.$route.params.key,
                        teacherKey: this.teacherData.key,
                        academicKey: academicKey
                      })
                      .then(() => {
                        this.$router.push(
                          "/summaryTable/" + this.$route.params.key
                        );
                        this.hideLoading();
                      });
                  });
              } else {
                this.$router.push("/summaryTable/" + this.$route.params.key);
                this.hideLoading();
              }
            });
        });
    },
    sortNumber() {
      this.testData.sort((a, b) => {
        if (this.sortNumberType == "ASC") {
          return a.studentNo - b.studentNo;
        } else {
          return b.studentNo - a.studentNo;
        }
      });
      if (this.sortNumberType == "DESC") {
        this.sortNumberType = "ASC";
      } else {
        this.sortNumberType = "DESC";
      }
    },
    sortAnswer() {
      this.testData.sort((a, b) => {
        if (this.sortAnswerType == "ASC") {
          return a.currentQuestion - b.currentQuestion;
        } else {
          return b.currentQuestion - a.currentQuestion;
        }
      });

      if (this.sortAnswerType == "DESC") {
        this.sortAnswerType = "ASC";
      } else {
        this.sortAnswerType = "DESC";
      }
    },
    async getAllData() {
      this.showLoading();
      this.getTestData();
    },
    async getTestData() {
      let academicYear = await this.getAcademicYear();
      this.totalQuestion = await this.getTotalQuestion();
      db.collection("studentScoreLog")
        .where("academicKey", "==", academicYear)
        .where("practiceKey", "==", this.$route.params.key)
        .where("room", "==", this.$q.localStorage.getItem("classroomSelected"))
        .where("schoolCode", "==", this.teacherData.school)
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          let dataTemp = [];
          this.finishStudent = 0;
          doc.forEach(element => {
            if (element.data().status == true) {
              this.finishStudent += 1;
            }
            let key = {
              key: element.id
            };
            let dataFinal = { ...key, ...element.data() };
            dataTemp.push(dataFinal);
          });
          this.hideLoading();
          // SORT เลขที่ น้อยไปมาก รอเทสอีกที
          dataTemp.sort((a, b) => {
            return a.studentNo - b.studentNo;
          });
          this.testData = dataTemp;
        });
    },
    async getTotalQuestion() {
      let totalQuestion = await db
        .collection("Test")
        .doc("Server")
        .collection("data")
        .where("practiceKey", "==", this.$route.params.key)
        .get();
      return totalQuestion.size;
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.getAllData();
    this.minutes = this.$q.localStorage.getItem("minutes");
    this.seconds = this.$q.localStorage.getItem("seconds");
    this.timeInterval = setInterval(() => {
      if (this.minutes < 0) {
        // หมดเวลา
        this.showTimeoutText = true;
        clearInterval(this.timeInterval);
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
      clearInterval(_this.timeInterval);
      this.onlineStudentSnapshot();
    };

    this.getOnlineStudent();
  }
};
</script>

<style>
.border-number {
  border-right: 1px solid #353535;
  border-top: 1px solid #353535;
  border-bottom: 1px solid #353535;
}
.border-left {
  border-left: 1px solid #353535;
}
</style>