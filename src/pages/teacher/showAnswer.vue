<template>
  <div>
    <teacher-bar
      :isShowBackBtn="true"
      :backtopagename="'/teacherStudyplan'"
      @testFunc="clearIntervalFunc()"
    ></teacher-bar>
    <div v-if="answerData.length > 0" class="q-pa-sm">
      <!-- IMAGE HEADER -->
      <!-- <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">เฉลยการบ้าน</div>
      </div>-->
      <!-- CONTENT -->
      <div
        class="bg8 q-pa-md"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div>
          <!-- CLOCK -->
          <div align="right" class="float-right">
            <div
              style="width:120px;border-radius:10px;border:2px solid #353535 "
              class="q-pa-sm text-h6 bg-white"
              align="center"
            >
              <span v-show="!showTimeoutText">
                <q-icon class="far fa-clock" />
                {{ minutes }}: {{ seconds }}
              </span>
              <span
                v-show="showTimeoutText"
                class="animated flash infinite color11"
                style="animation-duration:1.5s"
              >หมดเวลา</span>
            </div>
          </div>
          <div align="center" class="q-pt-sm">
            <div
              align="center"
              class="text-h5"
            >เฉลยการบ้าน ข้อ {{ currentQuestion+1 }} / {{ answerData.length }}</div>
          </div>

          <!-- PDF SHOW -->
          <div
            class="q-pa-lg bg-white"
            align="center"
            style="border:1px solid #353535;height:72vh;margin-top:25px"
          >
            <embed
              :src="answerData[currentQuestion].pdfURL + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH'"
              type
              style="width:100%;height:100%"
            />
          </div>
          <!-- next and previous button and finish button -->
          <div class="q-pt-md row">
            <div align="left" :class="{'col-6' : !isShowFinishButton,'col-4' : isShowFinishButton}">
              <q-btn
                @click="nextAnswer('previous')"
                icon="fas fa-chevron-left"
                push
                class="bg5 color2"
                :disable="currentQuestion == 0 || isDisable"
              ></q-btn>
            </div>
            <div align="center" v-show="isShowFinishButton" class="col-4">
              <q-btn
                @click="finishAnswer()"
                push
                class="bg5 color2"
                label="เสร็จสิ้น"
                style="width:250px"
              ></q-btn>
            </div>
            <div
              align="right"
              :class="{'col-6' : !isShowFinishButton,'col-4' : isShowFinishButton}"
            >
              <q-btn
                :disable="currentQuestion == answerData.length -1 || isDisable"
                @click="nextAnswer('next')"
                icon="fas fa-chevron-right"
                push
                class="bg5 color2"
              ></q-btn>
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
      answerSheetKey: this.$route.params.key,
      answerData: [],
      currentQuestion: 0,
      teacherData: this.$q.localStorage.getItem("teacherData"),
      answerArr: [0],
      isShowFinishButton: false,
      minutes: 0,
      seconds: 0,
      showTimeoutText: false,
      teacherData: this.$q.localStorage.getItem("teacherData"),
      myInterval: "",
      isDisable: false
    };
  },
  methods: {
    loadAnswerSheet() {
      this.showLoading();
      db.collection("AnswerSheet")
        .where("key", "==", this.answerSheetKey)
        .get()
        .then(doc => {
          let answerTemp = [];
          doc.forEach(element => {
            let dataKey = { key: element.id };
            let dataFinal = { ...dataKey, ...element.data() };
            answerTemp.push(dataFinal);
          });
          this.answerData = answerTemp;
          this.answerData.sort((a, b) => {
            return a.no - b.no;
          });
          this.hideLoading();
        });
    },
    nextAnswer(type) {
      this.showLoading();
      this.isDisable = true;
      if (type == "next") {
        if (!this.answerArr.includes(this.currentQuestion + 1)) {
          this.answerArr.push(this.currentQuestion + 1);
        }
      }
      db.collection("Synchronize")
        .doc(this.teacherData.key)
        .update({
          answerArr: this.answerArr
        })
        .then(() => {
          if (type == "next") {
            this.currentQuestion++;
          } else {
            this.currentQuestion--;
          }
          if (this.answerData.length == this.answerArr.length) {
            this.isShowFinishButton = true;
          }
          this.isDisable = false;
          this.hideLoading();
        });
    },
    async finishAnswer() {
      // ROUTE TO SUMMARY PAGE BY PASSING PARAMETER answerSheetKey
      this.showLoading();
      this.clearIntervalFunc();
      let academicKey = await this.getAcademicYear();
      let getTime = await this.getTime();
      db.collection("Synchronize")
        .doc(this.teacherData.key)
        .update({
          answerArr: this.answerArr,
          studyplanType: "สรุป",
          studyplanKey: this.$route.params.key
        })
        .then(() => {
          db.collection("StudyplanReportLog")
            .add({
              schoolKey: this.teacherData.school,
              time: getTime,
              practicekey: this.$route.params.key + "-answer",
              teacherKey: this.teacherData.key,
              academicKey: academicKey,
              classroom: this.$q.localStorage.getItem("classroomSelected"),
              section: this.$q.localStorage.getItem("currentSectionNumber"),
              microtime: getTime.microtime,
              practiceType: "เฉลยการบ้าน"
            })
            .then(() => {
              db.collection("TeacherStudyplanLog")
                .where("practiceKey", "==", this.$route.params.key + "-answer")
                .where("teacherKey", "==", this.teacherData.key)
                .where("academicKey", "==", academicKey)
                .get()
                .then(teacherCheck => {
                  if (teacherCheck.size == 0) {
                    db.collection("TeacherStudyplanLog")
                      .add({
                        status: true,
                        time: getTime,
                        practiceKey: this.$route.params.key + "-answer",
                        teacherKey: this.teacherData.key,
                        academicKey: academicKey
                      })
                      .then(() => {
                        this.$q.localStorage.set(
                          "showAnswerType",
                          "สรุปผลคะแนน"
                        );
                        this.$router.push(
                          "/summaryTable/" + this.answerSheetKey
                        );
                        this.hideLoading();
                      });
                  } else {
                    this.$router.push("/summaryTable/" + this.answerSheetKey);
                    this.hideLoading();
                  }
                });
            });
        });
    },

    clearIntervalFunc() {
      clearInterval(this.myInterval);
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.loadAnswerSheet();
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
      clearInterval(_this.myInterval);
    };
  }
};
</script>

<style lang="scss" scoped>
</style>