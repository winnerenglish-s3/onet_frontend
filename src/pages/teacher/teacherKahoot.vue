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
        <div class="absolute-full flex flex-center color1 text-h6">แบบฝึกหัด</div>
      </div>
      <!-- CONTENT -->
      <div
        v-if="!isLoading"
        class="bg8 q-py-lg q-pa-lg"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <!-- แสดงปุ่มจำนวนข้อ -->
        <div
          class="row items-center q-col-gutter-sm reverse-wrap"
          v-show="showPage != 3 && showPage != 4"
        >
          <div class="col-md-8 col-xs-12">
            <div class="row text-h6 borders1-md">
              <div
                align="center"
                v-for="(item,index) in questionData"
                :key="index"
                class="col q-pa-xs bg2"
                :class="{'borders1-r-md' : index != questionData.length - 1,'bg7 color2' : index == currentQuestion,'bg5' : finishedPractice.includes(index)}"
              >{{ index +1 }}</div>
            </div>
          </div>
          <div class="col-md-4 col-xs-12 row justify-end">
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
            <div
              style="width:120px;border-radius:10px;border:2px solid #353535 "
              class="q-pa-sm text-h6 bg-white"
              align="center"
            >
              <span>
                <q-icon name="far fa-clock" class="q-pr-sm q-pb-xs" />
                {{ finishStudent }} / {{ totalOnlineStudent }}
              </span>
            </div>
          </div>
        </div>

        <!-- Instruction -->
        <!-- Mode แสดงคำสั่ง -->
        <div v-show="showPage == 0" class="animated fadeIn">
          <div
            class="bg9 q-mt-lg q-pa-lg text-h3 color1 flex"
            style="letter-spacing:1.5px;line-height:70px"
            v-if="questionData[currentQuestion].type == 1"
            v-html="questionData[currentQuestion].question"
          ></div>
          <div v-else>
            <div
              class="bg9 q-mt-lg q-pa-lg text-h3 color1"
              v-html="questionData[currentQuestion].question"
            ></div>
            <div class="q-mt-lg q-pa-lg" align="center">
              <q-img :src="questionData[currentQuestion].questionURL" style="max-width:500px">
                <div
                  class="absolute-bottom-right bg-transparent text-subtitle1 text-center q-pa-xs"
                  align="right"
                >
                  <q-btn round class="bg1" size="15px" @click="expandedImg()">
                    <span class="text-h6">
                      <span class="fas fa-search-plus"></span>
                    </span>
                  </q-btn>
                </div>
              </q-img>
            </div>
          </div>
        </div>
        <q-dialog v-model="showImageFullscreen">
          <q-img :src="questionData[currentQuestion].questionURL" />
        </q-dialog>
        <!-- QUESTION -->
        <!-- MODE แสดงแบบฝึกหัด -->
        <div class="q-pt-lg animated fadeIn" v-show="showPage == 1 || showPage == 2">
          <!-- show question -->
          <!-- คำสั่ง กรณีแบบฝึกหัดไม่มีรูป -->
          <div
            v-if="questionData[currentQuestion].type == 1"
            class="bg9 q-pa-lg text-h4"
            v-html="questionData[currentQuestion].question "
          ></div>

          <!-- show practice type text-->
          <!-- แบบฝึกหัดทั่วไป -->
          <div class="row q-pt-lg q-pa-sm" v-if="questionData[currentQuestion].type == 1">
            <div
              class="col-md-6 col-xs-12 row q-pa-sm row"
              v-for="(item,index) in questionData[currentQuestion].choices"
              :key="index"
            >
              <div
                class="col-12 row q-pa-sm items-center"
                :class="{'bg10' : index == 0,'bg6' : index == 1,'bg4' : index == 2,'bg7' :index == 3}"
                style="border-radius:10px"
              >
                <div class="col-md-2 col-xs-3 q-py-xl text-h2 color2" align="center">
                  <span v-if="index == 0" class="fas fa-motorcycle"></span>
                  <span v-else-if="index == 1" class="fas fa-car-side"></span>
                  <span v-else-if="index == 2" class="fas fa-helicopter"></span>
                  <span v-else class="fas fa-plane"></span>
                </div>
                <div
                  class="col q-py-xl q-pa-md text-h4 bg-white fit row items-center justify-center"
                  style="border-top-right-radius:10px;border-bottom-right-radius:10px"
                >
                  <div v-html="item"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- แบบฝึกหัด โจทย์มีรูป -->
          <div class="row q-pt-lg-q-pa-sm" v-else>
            <!-- Left column -->
            <div class="col-6 q-pa-sm">
              <div class="bg9 q-pa-lg text-h5 fit">
                <!-- คำสั่งโจทย์แบบฝึกหัดมีรูปภาพ -->
                <div class="q-pb-md" v-html="questionData[currentQuestion].question"></div>
                <q-img :src="questionData[currentQuestion].questionURL" style="width:100%">
                  <div
                    class="absolute-bottom-right bg-transparent text-subtitle1 text-center q-pa-xs"
                    align="right"
                  >
                    <q-btn round class="bg1" size="15px" @click="expandedImg()">
                      <span class="text-h6">
                        <span class="fas fa-search-plus"></span>
                      </span>
                    </q-btn>
                  </div>
                </q-img>
              </div>
            </div>
            <!-- Right column -->
            <div class="col-6 q-pa-sm row">
              <div
                v-for="(item,index) in questionData[currentQuestion].choices"
                :key="index"
                class="col-12 row q-pa-sm items-center"
                :class="{'bg10' : index == 0,'bg6 q-mt-sm ' : index == 1,'bg4 q-mt-sm ' : index == 2,'bg7 q-mt-sm ' :index == 3}"
                style="border-radius:10px"
              >
                <div class="col-sm-2 col-xs-4 q-py-xl text-h5 color2" align="center">
                  <span v-if="index == 0" class="text-h3">
                    <span class="fas fa-motorcycle"></span>
                  </span>
                  <span v-else-if="index == 1" class="text-h3">
                    <span class="fas fa-car-side"></span>
                  </span>
                  <span v-else-if="index == 2" class="text-h3">
                    <span class="fas fa-helicopter"></span>
                  </span>
                  <span v-else class="text-h3">
                    <span class="fas fa-plane"></span>
                  </span>
                </div>
                <div
                  class="col q-py-xl q-pa-md text-h5 bg-white fit row items-center justify-center"
                  style="border-top-right-radius:10px;border-bottom-right-radius:10px"
                >
                  <div v-html="item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- กราฟแสดงผลคะแนน -->
        <div class="q-pt-lg animated fadeIn" v-show="showPage == 3">
          <div align="center" class="text-h5 q-pb-md">จำนวนคนที่ตอบ</div>
          <div class="row items-end">
            <div class="col-3" v-for="i in questionData[currentQuestion].choices.length" :key="i">
              <div align="center" class="text-h4 q-pb-md">{{ summaryAnswer[i-1] }} คน</div>
              <div class="q-px-md-lg q-px-xs-sm" style="border-bottom:3px solid">
                <!-- :style="'height:' +((factor * summaryAnswer[i-1])+10) + 'px'" -->

                <div
                  :class="{'bg10' : i == 1,'bg5' : i == 2,'bg4':i == 3,'bg7' : i == 4}"
                  style="width:100%;"
                  :style="'height:' + graphHeight[i-1] + 'px'"
                ></div>
              </div>
            </div>
          </div>
          <!-- answer sign -->
          <div class="row">
            <div class="col-3" v-for="i in 4" :key="i">
              <div align="center" class="text-h4 q-pt-md">
                <span v-if="i == 1" class="text-h3">
                  <span class="fas fa-motorcycle"></span>
                </span>
                <span v-else-if="i == 2" class="text-h3">
                  <span class="fas fa-car-side"></span>
                </span>
                <span v-else-if="i == 3" class="text-h3">
                  <span class="fas fa-helicopter"></span>
                </span>
                <span v-else class="text-h3">
                  <span class="fas fa-plane"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- เฉลย -->
        <div class="q-pt-lg animated fadeIn" v-show="showPage == 4">
          <div
            class="bg9 q-mt-lg q-pa-lg text-h5 color1"
            v-html="questionData[currentQuestion].question"
            v-show="questionData[currentQuestion].type == 1"
          ></div>
          <!-- เฉลยแบบไม่มีรูป -->
          <div class="row q-pt-lg q-pa-sm" v-if="questionData[currentQuestion].type == 1">
            <div
              class="col-md-6 col-xs-12 row q-pa-sm row"
              v-for="(item,index) in questionData[currentQuestion].choices"
              :key="index"
            >
              <div
                :class="{'bg3' :questionData[currentQuestion].correctAnswer != index+1,'bg5' : questionData[currentQuestion].correctAnswer == index+1}"
                class="col-12 row q-pa-sm items-center"
                style="border-radius:10px"
              >
                <div class="col-2 q-py-xl text-h2 color2" align="center">
                  <span v-if="questionData[currentQuestion].correctAnswer != index +1">
                    <span v-if="index == 0" class="text-h3">
                      <span class="fas fa-motorcycle"></span>
                    </span>
                    <span v-else-if="index == 1" class="text-h3">
                      <span class="fas fa-car-side"></span>
                    </span>
                    <span v-else-if="index == 2" class="text-h3">
                      <span class="fas fa-helicopter"></span>
                    </span>
                    <span v-else class="text-h3">
                      <span class="fas fa-plane"></span>
                    </span>
                  </span>
                  <span v-else class="text-h3">
                    <q-icon name="fas fa-check"></q-icon>
                  </span>
                </div>
                <div
                  class="col q-py-xl q-pa-md text-h4 bg-white fit row items-center justify-center"
                  style="border-top-right-radius:10px;border-bottom-right-radius:10px"
                >
                  <div v-html="item"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- เฉลยแบบมีรูป -->

          <div class="row q-pt-lg-q-pa-sm" v-else>
            <!-- Left column -->
            <div class="col-6 q-pa-sm">
              <div class="bg9 q-pa-lg text-h5 fit">
                <!-- เฉลย คำสั่งโจทย์แบบฝึกหัดมีรูปภาพ -->
                <div class="q-pb-md" v-html="questionData[currentQuestion].question"></div>
                <q-img :src="questionData[currentQuestion].questionURL" style="width:100%">
                  <div
                    class="absolute-bottom-right bg-transparent text-subtitle1 text-center q-pa-xs"
                    align="right"
                  >
                    <q-btn round class="bg1" size="15px" @click="expandedImg()">
                      <span class="text-h6">
                        <span class="fas fa-search-plus"></span>
                      </span>
                    </q-btn>
                  </div>
                </q-img>
              </div>
            </div>
            <!-- Right column -->
            <div class="col-6 q-pa-sm row">
              <div
                v-for="(item,index) in questionData[currentQuestion].choices"
                :key="index"
                class="col-12 row q-pa-sm items-center"
                :class="{'bg3' :questionData[currentQuestion].correctAnswer != index+1,'bg5' : questionData[currentQuestion].correctAnswer == index+1,'q-mt-md' : index != 0}"
                style="border-radius:10px"
              >
                <div class="col-sm-2 col-xs-4 q-py-xl text-h5 color2" align="center">
                  <span v-if="questionData[currentQuestion].correctAnswer != index +1">
                    <span v-if="index == 0" class="text-h3">
                      <span class="fas fa-motorcycle"></span>
                    </span>
                    <span v-else-if="index == 1" class="text-h3">
                      <span class="fas fa-car-side"></span>
                    </span>
                    <span v-else-if="index == 2" class="text-h3">
                      <span class="fas fa-helicopter"></span>
                    </span>
                    <span v-else class="text-h3">
                      <span class="fas fa-plane"></span>
                    </span>
                  </span>
                  <span v-else class="text-h3">
                    <q-icon name="fas fa-check"></q-icon>
                  </span>
                </div>
                <div
                  class="col q-py-xl q-pa-md text-h5 bg-white fit row items-center justify-center"
                  style="border-top-right-radius:10px;border-bottom-right-radius:10px"
                >
                  <div v-html="item"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- คำอธิบายคำตอบ -->
          <div class="q-pa-sm text-h5" v-html="questionData[currentQuestion].description"></div>
        </div>
        <!-- ปุ่มเริ่มทำ -->
        <div v-show="showPage != 3 " align="center" class="q-pt-lg">
          <q-btn @click="nextPage()" style="width:250px" class="bg5 color2">
            <span v-if="showPage == 0 || showPage == 2 || showPage == 4 ">ถัดไป</span>
            <span v-else>เริ่มทำ</span>
          </q-btn>
        </div>

        <!-- ปุ่ม ย้อนกลับ / ถัดไป หน้า Graph สรุปคะแนน -->
        <div class="q-pt-lg q-gutter-md" v-show="showPage == 3" align="center">
          <q-btn @click="previousPage()" label="ย้อนกลับ" push class="bg2" style="width:200px"></q-btn>
          <q-btn @click="nextPage()" label="ถัดไป" push class="bg5 color2" style="width:200px"></q-btn>
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
      questionData: [],
      minutes: 0,
      seconds: 0,
      showTimeoutText: false,
      isLoading: true,
      currentQuestion: 0,
      showPage: 0,
      teacherData: this.$q.localStorage.getItem("teacherData"),
      finishedPractice: [],
      showImageFullscreen: false,
      totalStudent: 0,
      finishStudent: 0,
      summaryAnswer: [0, 0, 0, 0],
      myInterval: null,
      totalOnlineStudent: 0,
      graphHeight: [],
      factor: 0
    };
  },
  methods: {
    clearIntervalFunc() {
      clearInterval(this.myInterval);
      this.onlineStudentSnapshot();
    },
    expandedImg() {
      this.showImageFullscreen = true;
    },
    previousPage() {
      this.showPage = 2;
    },
    async loadQuestion() {
      this.showLoading();
      let checkSync = await db
        .collection("Synchronize")
        .doc(this.teacherData.key)
        .get();

      this.currentQuestion = checkSync.data().currentQuestion;
      this.finishedPractice = checkSync.data().kahootFinishedPractice
        ? checkSync.data().kahootFinishedPractice
        : [];
      db.collection("MultipleChoice")
        .doc("Server")
        .collection("data")
        .where("practiceKey", "==", this.$route.params.key)
        .get()
        .then(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            let choices = [
              element.data().choice1.replace(/<[^>]*>?/gm, ""),
              element.data().choice2.replace(/<[^>]*>?/gm, ""),
              element.data().choice3.replace(/<[^>]*>?/gm, ""),
              element.data().choice4.replace(/<[^>]*>?/gm, "")
            ];
            let dataKey = { key: element.id, choices: choices };
            let dataFinal = { ...dataKey, ...element.data() };
            dataTemp.push(dataFinal);
          });
          dataTemp.sort((a, b) => {
            return a.orderId - b.orderId;
          });
          this.questionData = dataTemp;
          // this.getOnlineStudent();
          this.getFinishStudent();
          this.hideLoading();
          this.isLoading = false;
        });
    },
    async nextPage() {
      this.showLoading();
      let academicKey = await this.getAcademicYear();

      if (this.showPage == 0) {
        this.showPage = 1;
        this.hideLoading();
      } else if (this.showPage == 1) {
        // โชว์แบบฝึกหัด
        db.collection("Synchronize")
          .doc(this.teacherData.key)
          .update({
            practiceType: "ทำแบบฝึกหัด",
            currentQuestion: this.currentQuestion
          })
          .then(() => {
            this.showPage = 2;
            this.hideLoading();
          });
      } else if (this.showPage == 2) {
        // show กราฟสรุป
        db.collection("Synchronize")
          .doc(this.teacherData.key)
          .update({ practiceType: "กราฟสรุป" })
          .then(() => {
            this.showPage = 3;
            this.hideLoading();
          });
      } else if (this.showPage == 3) {
        // show เฉลย
        db.collection("Synchronize")
          .doc(this.teacherData.key)
          .update({ practiceType: "เฉลย" })
          .then(() => {
            this.summaryAnswer = [0, 0, 0, 0];
            this.graphHeight = [10, 10, 10, 10];
            this.showPage = 4;
            this.hideLoading();
          });
      } else {
        if (this.currentQuestion < this.questionData.length - 1) {
          let cloneFinishPractice = this.finishedPractice.slice();
          cloneFinishPractice.push(this.currentQuestion);
          db.collection("Synchronize")
            .doc(this.teacherData.key)
            .update({
              practiceType: "คำสั่ง",
              currentQuestion: this.currentQuestion + 1,
              kahootFinishedPractice: cloneFinishPractice
            })
            .then(() => {
              this.showPage = 0;
              this.finishedPractice.push(this.currentQuestion);
              this.currentQuestion += 1;
              this.finishStudent = 0;

              this.hideLoading();
            });
        } else {
          // กรณีทำเสร็จข้อสุดท้ายไปหน้าสรุป
          let getTime = await this.getTime();
          this.$q.localStorage.set("showAnswerType", "สรุปผลคะแนน");
          db.collection("Synchronize")
            .doc(this.teacherData.key)
            .update({ studyplanType: "สรุป" })
            .then(() => {
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
                  practiceType: "แบบฝึกหัด"
                })
                .then(() => {
                  db.collection("TeacherStudyplanLog")
                    .where("practiceKey", "==", this.$route.params.key)
                    .where("teacherKey", "==", this.teacherData.key)
                    .where("academicKey", "==", academicKey)
                    .get()
                    .then(checkExists => {
                      if (checkExists.size == 0) {
                        db.collection("TeacherStudyplanLog")
                          .add({
                            status: true,
                            time: getTime,
                            practiceKey: this.$route.params.key,
                            teacherKey: this.teacherData.key,
                            academicKey: academicKey
                          })
                          .then(() => {
                            clearInterval(this.myInterval);
                            this.$router.push(
                              "/summaryTable/" + this.$route.params.key
                            );
                            this.hideLoading();
                          });
                      } else {
                        clearInterval(this.myInterval);
                        this.$router.push(
                          "/summaryTable/" + this.$route.params.key
                        );
                        this.hideLoading();
                      }
                    });
                });
            });
        }
      }
    },
    async getFinishStudent() {
      let academicKey = await this.getAcademicYear();
      db.collection("studentScoreLog")
        .where("practiceKey", "==", this.$route.params.key)
        .where("schoolCode", "==", this.teacherData.school)
        .where("room", "==", this.$q.localStorage.getItem("classroomSelected"))
        .where("academicKey", "==", academicKey)
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          let a1 = 0;
          let a2 = 0;
          let a3 = 0;
          let a4 = 0;
          this.finishStudent = 0;
          doc.forEach(element => {
            if (
              element.data().dataAnswerList[this.currentQuestion].answer == 1
            ) {
              a1++;
            } else if (
              element.data().dataAnswerList[this.currentQuestion].answer == 2
            ) {
              a2++;
            } else if (
              element.data().dataAnswerList[this.currentQuestion].answer == 3
            ) {
              a3++;
            } else if (
              element.data().dataAnswerList[this.currentQuestion].answer == 4
            ) {
              a4++;
            }

            if (
              element.data().dataAnswerList[this.currentQuestion].answer != 0
            ) {
              // จำนวนนักเรียนที่ทำแบบฝึกหัดเสร็จ
              this.finishStudent += 1;
            }
          });
          this.summaryAnswer = [a1, a2, a3, a4];

          let totalStudentAnswer = this.summaryAnswer.reduce((a, b) => {
            return a + b;
          });

          let graphHeight = [0, 0, 0, 0];

          for (let h = 0; h < this.summaryAnswer.length; h++) {
            graphHeight[h] = Math.round(
              (this.summaryAnswer[h] / totalStudentAnswer) * 100
            );
          }
          for (let hh = 0; hh < graphHeight.length; hh++) {
            graphHeight[hh] = (graphHeight[hh] / 100) * 400;
            if (!graphHeight[hh]) {
              graphHeight[hh] = 10;
            }
          }
          this.graphHeight = graphHeight;
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
          console.log(doc.size);
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
      clearInterval(_this.myInterval);
      this.onlineStudentSnapshot();
    };
    this.loadQuestion();
    this.getOnlineStudent();
  }
};
</script>

<style lang="scss" scoped>
</style>