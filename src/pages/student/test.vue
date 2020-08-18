<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-pa-md">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h6 text-bold">
            แบบทดสอบ
            <span v-if="isSteps == 1">({{currentQuestion + 1 + "/" + dataQuestionSize}})</span>
          </span>
        </div>
      </div>
      <div class="bg8 q-pt-md borders1-sm borders-rb q-mx-sm" align="center">
        <div v-if="isSteps == 0">
          <waiting :setType="'ready'"></waiting>
        </div>

        <div v-if="isSteps == 2">
          <waiting :setType="'waitfriend'"></waiting>
        </div>

        <div v-if="isSteps == 3">
          <waiting :setType="'waiting'"></waiting>
        </div>

        <div v-if="isSteps == 1">
          <div
            class="row justify-center items-center me-scrollbar"
            v-if="dataQuestionList.length == 0"
          >
            <div class>
              <q-spinner-dots class="color10" size="100px" />
            </div>
          </div>

          <div class="q-px-lg" v-if="dataQuestionList.length > 0">
            <div
              class="row bg9 q-my-lg q-py-sm"
              v-show="dataQuestionList[currentQuestion].type == 1 || dataQuestionList[currentQuestion].type == 3"
            >
              <div class="col q-pa-sm q-pl-lg text-h6 self-center" align="left">
                <span
                  v-html="currentQuestion + 1 + '. ' + dataQuestionList[currentQuestion].question"
                ></span>
              </div>
            </div>

            <div class="row justify-center items-center me-scrollbar" v-if="isLoadData">
              <div class>
                <q-spinner-dots class="color10" size="100px" />
              </div>
            </div>

            <div class="q-my-lg" v-if="dataChoiceList.length > 0">
              <!-- NOTE is question type 1 multiple choice เลือกคำตอบ -->
              <div v-if="dataQuestionList[currentQuestion].type == 1" class="animated fadeIn">
                <div v-if="!isAnswer">
                  <q-btn
                    @click="answerBtn(item.answer)"
                    flat
                    class="full-width bg2 borders-ra q-mt-md no-padding"
                    v-for="(item,index) in dataChoiceList[currentQuestion]"
                    :key="index"
                    :disabled="isSaveData"
                    no-caps
                  >
                    <div
                      class="row full-width borders-ra"
                      :class="{'borders10-lg':index == 0 ,'borders6-lg':index == 1 ,'borders4-lg':index == 2 ,'borders7-lg':index == 3 }"
                    >
                      <div
                        class="col-2 text-white text-h2 text-bold relative-position"
                        style="width:120px;padding:60px 0px;"
                        :class="{'bg10 ':index == 0 ,'bg6':index == 1 ,'bg4':index == 2 ,'bg7':index == 3 }"
                        align="center"
                      >
                        <span class="absolute-center">
                          <i v-if="index == 0" class="fas fa-motorcycle"></i>
                          <i v-if="index == 1" class="fas fa-car-side"></i>
                          <i v-if="index == 2" class="fas fa-helicopter"></i>
                          <i v-if="index == 3" class="fas fa-plane"></i>
                        </span>
                      </div>
                      <div class="col colors1 text-h6 self-center" align="center">
                        <span v-if="index == 0">{{item.choice}}</span>
                        <span v-if="index == 1">{{item.choice}}</span>
                        <span v-if="index == 2">{{item.choice}}</span>
                        <span v-if="index == 3">{{item.choice}}</span>
                      </div>
                    </div>
                  </q-btn>
                </div>
                <!-- NOTE is Answer : เฉลยคำตอบ -->
                <div v-if="isAnswer">
                  <q-btn
                    flat
                    class="full-width bg2 borders-ra q-mt-md no-padding no-pointer-events"
                    v-for="(item,index) in dataChoiceList[currentQuestion]"
                    :key="index"
                    no-caps
                  >
                    <div
                      class="row full-width borders-ra"
                      :class="{'borders3-lg':dataAnswerList[currentQuestion].answer != item.answer,'borders5-lg':dataQuestionList[currentQuestion].correctAnswer == item.answer,'borders11-lg':dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer}"
                    >
                      <div
                        class="col-2 text-white text-h2 text-bold relative-position"
                        style="width:120px;padding:60px 0px;"
                        :class="{'bg3':dataQuestionList[currentQuestion].answer != item.answer,'bg5':dataQuestionList[currentQuestion].correctAnswer == item.answer,'bg11':dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer}"
                        align="center"
                      >
                        <span
                          class="absolute-center"
                          v-if="dataAnswerList[currentQuestion].answer != item.answer && dataQuestionList[currentQuestion].correctAnswer != item.answer"
                        >
                          <i v-if="index == 0" class="fas fa-motorcycle"></i>
                          <i v-if="index == 1" class="fas fa-car-side"></i>
                          <i v-if="index == 2" class="fas fa-helicopter"></i>
                          <i v-if="index == 3" class="fas fa-plane"></i>
                        </span>
                        <span
                          class="fas fa-check absolute-center"
                          v-if="dataQuestionList[currentQuestion].correctAnswer == item.answer"
                        ></span>
                        <span
                          class="fas fa-times absolute-center"
                          v-if="dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer"
                        ></span>
                      </div>
                      <div class="col colors1 text-h6 self-center q-pa-sm" align="center">
                        <span v-if="index == 0">{{item.choice}}</span>
                        <span v-if="index == 1">{{item.choice}}</span>
                        <span v-if="index == 2">{{item.choice}}</span>
                        <span v-if="index == 3">{{item.choice}}</span>
                      </div>
                    </div>
                  </q-btn>
                </div>
              </div>

              <!-- NOTE is question type 2 multiple choice and question image เลือกคำตอบ -->
              <div v-if="dataQuestionList[currentQuestion].type == 2" class="animated fadeIn">
                <div class="row">
                  <div class="col-md-6 col-xs-12 q-px-md q-pb-xs-md">
                    <div class="bg9 fit rounded-borders">
                      <div class="row q-pa-xs q-pt-sm">
                        <div class="col q-px-md text-h6 self-center" align="left">
                          <span
                            v-if="dataQuestionList.length > 0"
                            v-html="currentQuestion + 1 + '. ' + dataQuestionList[currentQuestion].question"
                          ></span>
                        </div>
                      </div>
                      <div class="q-px-lg q-py-md">
                        <q-img
                          :src="dataQuestionList[currentQuestion].questionURL"
                          style="width:100%;"
                        >
                          <div class="absolute-bottom-right text-h5 bg-transparent">
                            <q-btn round class="bg1" @click="showImage = true" size="15px">
                              <span class="text-h6">
                                <span class="fas fa-search-plus"></span>
                              </span>
                            </q-btn>
                          </div>
                        </q-img>
                        <q-dialog v-model="showImage">
                          <q-card style="width: 1000px; max-width: 80vw;">
                            <q-img :src="dataQuestionList[currentQuestion].questionURL">
                              <div class="absolute-top-right text-h5 bg-transparent">
                                <q-btn round class="bg1" size="15px" v-close-popup>
                                  <span class="text-h6">
                                    <span class="fas fa-times"></span>
                                  </span>
                                </q-btn>
                              </div>
                            </q-img>
                          </q-card>
                        </q-dialog>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-xs-12 bg8 q-px-sm" v-if="!isAnswer">
                    <q-btn
                      @click="answerBtn(item.answer)"
                      flat
                      class="full-width bg2 borders-ra q-mb-md no-padding"
                      v-for="(item,index) in dataChoiceList[currentQuestion]"
                      :key="index"
                      :disabled="isAnswer || isSaveData"
                      no-caps
                    >
                      <div
                        class="row full-width borders-ra"
                        :class="{'borders10-lg':index == 0 && !isAnswer,'borders6-lg':index == 1 && !isAnswer,'borders4-lg':index == 2 && !isAnswer,'borders7-lg':index == 3 && !isAnswer,'borders3-lg':isAnswer}"
                      >
                        <div
                          class="col-2 text-white text-h2 text-bold relative-position"
                          :class="{'bg10 ':index == 0 && !isAnswer,'bg6':index == 1 && !isAnswer,'bg4':index == 2 && !isAnswer,'bg7':index == 3 && !isAnswer,'bg3':isAnswer}"
                          style="min-width:120px;max-width:150px;padding:60px 0px;"
                          align="center"
                        >
                          <span class="absolute-center">
                            <i v-if="index == 0" class="fas fa-motorcycle"></i>
                            <i v-if="index == 1" class="fas fa-car-side"></i>
                            <i v-if="index == 2" class="fas fa-helicopter"></i>
                            <i v-if="index == 3" class="fas fa-plane"></i>
                          </span>
                        </div>
                        <div
                          class="col colors1 text-body1 self-center q-pa-sm"
                          align="center"
                          style
                        >
                          <span v-if="index == 0">{{item.choice}}</span>
                          <span v-if="index == 1">{{item.choice}}</span>
                          <span v-if="index == 2">{{item.choice}}</span>
                          <span v-if="index == 3">{{item.choice}}</span>
                        </div>
                      </div>
                    </q-btn>
                  </div>
                  <!-- NOTE is Answer : เฉลยคำตอบ -->
                  <div class="col bg8 q-px-sm" v-else>
                    <q-btn
                      flat
                      class="full-width bg2 borders-ra q-mb-md no-padding no-pointer-events"
                      v-for="(item,index) in dataChoiceList[currentQuestion]"
                      :key="index"
                      no-caps
                    >
                      <div
                        class="row full-width borders-ra"
                        :class="{'borders3-lg':dataAnswerList[currentQuestion].answer != item.answer,'borders5-lg':dataQuestionList[currentQuestion].correctAnswer == item.answer,'borders11-lg':dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer}"
                      >
                        <div
                          class="col-2 text-white text-h2 text-bold relative-position"
                          :class="{'bg3':dataQuestionList[currentQuestion].answer != item.answer,'bg5':dataQuestionList[currentQuestion].correctAnswer == item.answer,'bg11':dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer}"
                          style="min-width:120px;max-width:150px;padding:60px 0px;"
                          align="center"
                        >
                          <span
                            class="absolute-center"
                            v-if="dataAnswerList[currentQuestion].answer != item.answer && dataQuestionList[currentQuestion].correctAnswer != item.answer"
                          >
                            <i v-if="index == 0" class="fas fa-motorcycle"></i>
                            <i v-if="index == 1" class="fas fa-car-side"></i>
                            <i v-if="index == 2" class="fas fa-helicopter"></i>
                            <i v-if="index == 3" class="fas fa-plane"></i>
                          </span>
                          <span
                            v-if="dataQuestionList[currentQuestion].correctAnswer == item.answer"
                            class="fas fa-check absolute-center"
                          ></span>
                          <span
                            v-if="dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer"
                            class="fas fa-times absolute-center"
                          ></span>
                        </div>
                        <div class="col colors1 text-h6 self-center q-pa-sm" align="center">
                          <span v-if="index == 0">{{item.choice}}</span>
                          <span v-if="index == 1">{{item.choice}}</span>
                          <span v-if="index == 2">{{item.choice}}</span>
                          <span v-if="index == 3">{{item.choice}}</span>
                        </div>
                      </div>
                    </q-btn>
                  </div>
                </div>
              </div>

              <!-- NOTE is question type 3 multiple choice image เลือกคำตอบ -->
              <div v-if="dataQuestionList[currentQuestion].type == 3" class="animated fadeIn">
                <div v-if="!isAnswer">
                  <div class="row">
                    <div
                      class="col-md-6 col-xs-12 q-pa-sm"
                      v-for="(item,index) in dataChoiceList[currentQuestion]"
                      :key="index"
                    >
                      <q-btn
                        flat
                        class="full-width bg2 borders-ra no-padding"
                        @click="answerBtn(item.answer)"
                        :disabled="isSaveData"
                        no-caps
                      >
                        <div
                          class="row bg2 full-width borders-ra"
                          :class="{'borders10-lg':index == 0 && !isAnswer,'borders6-lg':index == 1 && !isAnswer,'borders4-lg':index == 2 && !isAnswer,'borders7-lg':index == 3 && !isAnswer,'borders3-lg':isAnswer}"
                        >
                          <div
                            class="col-2 text-white text-h2 text-bold relative-position"
                            :class="{'bg10 ':index == 0 && !isAnswer,'bg6':index == 1 && !isAnswer,'bg4':index == 2 && !isAnswer,'bg7':index == 3 && !isAnswer,'bg3':isAnswer}"
                            style="width:120px;padding:60px 0px;"
                            align="center"
                          >
                            <span class="absolute-center">
                              <i v-if="index == 0" class="fas fa-motorcycle"></i>
                              <i v-if="index == 1" class="fas fa-car-side"></i>
                              <i v-if="index == 2" class="fas fa-helicopter"></i>
                              <i v-if="index == 3" class="fas fa-plane"></i>
                            </span>
                          </div>
                          <div
                            class="col relative-position q-pa-sm"
                            style="height:200px;object-fit:scale-down;"
                            align="center"
                          >
                            <img :src="item.choice" style="width:100%;max-width:300px;height:100%" />
                          </div>
                        </div>
                      </q-btn>
                    </div>
                  </div>
                </div>
                <!-- NOTE is Answer : เฉลยคำตอบ -->
                <div v-else>
                  <div class="row">
                    <div
                      class="col-md-6 col-xs-12 q-pa-sm no-pointer-events"
                      v-for="(item,index) in dataChoiceList[currentQuestion]"
                      :key="index"
                    >
                      <q-btn flat class="full-width bg2 borders-ra no-padding" no-caps>
                        <div
                          class="row bg2 full-width borders-ra"
                          :class="{'borders3-lg':dataAnswerList[currentQuestion].answer != item.answer,'borders5-lg':dataQuestionList[currentQuestion].correctAnswer == item.answer,'borders11-lg':dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer}"
                        >
                          <div
                            class="col-2 text-white text-h2 text-bold relative-position"
                            :class="{'bg3':dataQuestionList[currentQuestion].answer != item.answer,'bg5':dataQuestionList[currentQuestion].correctAnswer == item.answer,'bg11':dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer}"
                            style="width:120px;padding:60px 0px;"
                            align="center"
                          >
                            <span
                              class="absolute-center"
                              v-if="dataAnswerList[currentQuestion].answer != item.answer && dataQuestionList[currentQuestion].correctAnswer != item.answer"
                            >
                              <i v-if="index == 0" class="fas fa-motorcycle"></i>
                              <i v-if="index == 1" class="fas fa-car-side"></i>
                              <i v-if="index == 2" class="fas fa-helicopter"></i>
                              <i v-if="index == 3" class="fas fa-plane"></i>
                            </span>
                            <span
                              v-if="dataQuestionList[currentQuestion].correctAnswer == item.answer"
                              class="fas fa-check absolute-center"
                            ></span>
                            <span
                              v-if="dataAnswerList[currentQuestion].answer == item.answer && dataQuestionList[currentQuestion].correctAnswer != dataAnswerList[currentQuestion].answer"
                              class="fas fa-times absolute-center"
                            ></span>
                          </div>
                          <div
                            class="col relative-position q-pa-sm"
                            style="height:200px;"
                            align="center"
                          >
                            <img :src="item.choice" style="width:100%;max-width:300px;height:100%" />
                          </div>
                        </div>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-h6 q-px-md q-mt-lg animated fadeInUp" align="left" v-if="isAnswer">
                <span v-html="'คำอธิบาย <br>' + dataQuestionList[currentQuestion].description"></span>
              </div>
              <div class="q-pt-lg animated zoomIn" id="test" v-show="isAnswer">
                <q-btn
                  v-if="isNext"
                  class="bg5 text-white"
                  style="width:250px;"
                  @click="nextBtn()"
                  :disabled="isDisabled"
                >ข้อถัดไป</q-btn>
                <q-btn
                  v-if="isFinish"
                  class="bg5 text-white"
                  style="width:250px;"
                  @click="finishBtn()"
                  :disabled="isDisabled"
                >เสร็จสิ้น</q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../../router/index.js";
import waiting from "../../components/waiting.vue";
export default {
  components: {
    waiting
  },
  data() {
    return {
      currentQuestion: 0,
      section: "", // เก็บข้อมูลคาบเรียน
      student: this.$q.localStorage.getItem("studentData"), // เก็บข้อมูลนักเรียน
      showImage: false,

      dataQuestionKey: "",
      dataQuestionList: [],
      dataQuestionSize: 0,

      dataChoiceList: [],
      dataAnswerList: [],
      dataAnswerCurrent: [],
      dataAnswerCorrect: 0,
      dataAnswerScore: 0,

      isSteps: 0,
      isLoadData: false, // โหลดข้อมูล
      isSaveData: false, // เช็คข้อมูลการบันทึก
      isAnswer: false, // แสดงหน้าคำอธิบายและเฉลย
      isNext: false, // แสดงปุ่มข้อถัดไป
      isFinish: false, // แสดงปุ่มส่งคำตอบถ้าทำแบบฝึกหัดเสร็จทั้งหมด

      // แสดงรูปภาพ
      showImage: false,

      isDisabled: false
    };
  },
  methods: {
    answerBtn(answer) {
      this.isSaveData = true;
      let finish = false;
      let sumFinish = 0;
      this.dataAnswerCorrect = 0;

      // เก็บคำตอบที่เลือก
      this.dataAnswerList[this.currentQuestion].answer = answer;
      this.dataAnswerList[
        this.currentQuestion
      ].correctAnswer = this.dataQuestionList[
        this.currentQuestion
      ].correctAnswer;

      // เก็บข้อมูล OrderId
      this.dataAnswerCurrent.push({
        orderId: this.dataQuestionList[this.currentQuestion].orderId
      });

      // เก็บสถานะที่ถูกต้อง
      if (answer == this.dataQuestionList[this.currentQuestion].correctAnswer) {
        this.dataAnswerList[this.currentQuestion].status = "ถูก";
      }

      for (let i = 0; i < this.dataAnswerList.length; i++) {
        if (this.dataAnswerList[i].status == "ถูก") {
          this.dataAnswerCorrect += 1;
        }
        if (this.dataAnswerList[i].answer != 0) {
          sumFinish += 1;
        }
      }

      if (sumFinish == this.dataQuestionSize) {
        finish = true;
      }

      this.dataAnswerScore =
        (this.dataAnswerCorrect / this.dataQuestionSize) * 100;

      db.collection("studentScoreLog")
        .doc(this.dataQuestionKey)
        .update({
          currentQuestion: this.currentQuestion + 1, // ไปข้อต่อไป
          dataAnswerList: this.dataAnswerList,
          dataAnswerCurrent: this.dataAnswerCurrent,
          scoreRaw: this.dataAnswerCorrect,
          status: finish,
          scorePercent: this.dataAnswerScore
        })
        .then(() => {
          this.isAnswer = true;

          if (this.dataQuestionSize == this.currentQuestion + 1) {
            this.isFinish = true;
          } else {
            this.isNext = true;
          }

          setTimeout(() => {
            document.documentElement.scrollTop =
              document.documentElement.scrollHeight;
          }, 100);
        });
    },
    nextBtn() {
      this.isDisabled = true;

      setTimeout(() => {
        this.currentQuestion += 1;
        this.isAnswer = false;
        this.isSaveData = false;
        this.isNext = false;
        this.isFinish = false;
        this.isDisabled = false;

        document.documentElement.scrollTop = 0;
      }, 500);
    },
    finishBtn() {
      this.isDisabled = true;
      setTimeout(() => {
        this.isSteps = 2;
        this.isDisabled = false;
      }, 500);
    },
    loadQuestion() {
      this.isLoadData = true;

      let practiceKey = this.$q.localStorage.getItem("practiceKey");

      db.collection("studentScoreLog")
        .where("academicKey", "==", this.student.year)
        .where("practiceKey", "==", practiceKey)
        .where("studentKey", "==", this.student.key)
        .get()
        .then(result => {
          // กรณีถ้าข้อมูลใน StudentScore มีข้อมูลอยู่แล้ว
          if (result.size > 0) {
            db.collection("Test")
              .doc("Server")
              .collection("data")
              .where("practiceKey", "==", practiceKey)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.dataQuestionSize = doc.size;
                  this.dataQuestionKey = result.docs[0].id;
                  this.dataAnswerList = result.docs[0].data().dataAnswerList;
                  this.dataAnswerCurrent = result.docs[0].data().dataAnswerCurrent;
                  let dataQuestionArr = [];
                  doc.forEach(data => {
                    let dataQuestion = {
                      ...data.data(),
                      ...{ key: data.id }
                    };

                    dataQuestionArr.push(dataQuestion);
                  });

                  if (result.docs[0].data().currentQuestion == doc.size) {
                    this.isSteps = 3;
                    this.currentQuestion =
                      result.docs[0].data().currentQuestion - 1;
                  } else {
                    this.currentQuestion = result.docs[0].data().currentQuestion;
                  }

                  let indexArray = result.docs[0].data().dataAnswerCurrent;
                  let newQuestionArr = [];
                  let currentQuestionArr = [];

                  for (let i = 0; i < dataQuestionArr.length; i++) {
                    let orderId = dataQuestionArr[i].orderId;

                    let indexOrder = indexArray
                      .map(item => {
                        return item.orderId;
                      })
                      .indexOf(orderId);

                    if (indexOrder >= 0) {
                      currentQuestionArr.push(dataQuestionArr[i]);
                    } else {
                      newQuestionArr.push(dataQuestionArr[i]);
                    }
                  }

                  newQuestionArr.sort(() => {
                    return 0.5 - Math.random();
                  });

                  Array.prototype.push.apply(
                    currentQuestionArr,
                    newQuestionArr
                  );
                  this.dataQuestionList = currentQuestionArr;

                  for (let i = 0; i < currentQuestionArr.length; i++) {
                    let orderId = currentQuestionArr[i].orderId;
                    let dataAnswerArr = {};
                    let dataAnswerOld = {};
                    let setData;
                    let choiceNumber = i;

                    dataAnswerArr = {
                      [choiceNumber]: []
                    };
                    if (currentQuestionArr[i].choice1) {
                      setData = {
                        answer: 1,
                        choice: currentQuestionArr[i].choice1
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].choice2) {
                      setData = {
                        answer: 2,
                        choice: currentQuestionArr[i].choice2
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].choice3) {
                      setData = {
                        answer: 3,
                        choice: currentQuestionArr[i].choice3
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].choice4) {
                      setData = {
                        answer: 4,
                        choice: currentQuestionArr[i].choice4
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].answer1URL) {
                      setData = {
                        answer: 1,
                        choice: currentQuestionArr[i].answer1URL
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].answer2URL) {
                      setData = {
                        answer: 2,
                        choice: currentQuestionArr[i].answer2URL
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].answer3URL) {
                      setData = {
                        answer: 3,
                        choice: currentQuestionArr[i].answer3URL
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }
                    if (currentQuestionArr[i].answer4URL) {
                      setData = {
                        answer: 4,
                        choice: currentQuestionArr[i].answer4URL
                      };
                      dataAnswerArr[choiceNumber].push(setData);
                    }

                    dataAnswerArr[choiceNumber].sort(() => {
                      return 0.5 - Math.random();
                    });

                    this.dataChoiceList.push(dataAnswerArr[choiceNumber]);
                  }

                  this.isLoadData = false;
                }
              });
          }

          // กรณีข้อมูลยังไม่มีข้อมูล
          else {
            let setSection = this.$q.localStorage.getItem("section").split("-");

            let dataAnswerCurrent = [];

            db.collection("Test")
              .doc("Server")
              .collection("data")
              .where("practiceKey", "==", practiceKey)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.dataQuestionSize = doc.size;
                  doc.forEach(data => {
                    let dataQuestion = {
                      ...data.data(),
                      ...{ key: data.id }
                    };

                    this.dataQuestionList.push(dataQuestion);
                  });

                  this.dataQuestionList.sort(() => {
                    return 0.5 - Math.random();
                  });

                  let dataAnswerArr = {};

                  for (let i = 0; i < this.dataQuestionList.length; i++) {
                    let dataChoice = {};
                    let setData;
                    let choiceNumber;

                    let dataAnswer = {
                      answer: 0,
                      status: "ผิด",
                      correctAnswer: 0
                    };

                    this.dataAnswerList.push(dataAnswer);

                    if (this.dataQuestionList[i]) {
                      choiceNumber = i;

                      dataAnswerArr = {
                        [choiceNumber]: []
                      };

                      if (this.dataQuestionList[i].choice1) {
                        setData = {
                          answer: 1,
                          choice: this.dataQuestionList[i].choice1
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }
                      if (this.dataQuestionList[i].choice2) {
                        setData = {
                          answer: 2,
                          choice: this.dataQuestionList[i].choice2
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }
                      if (this.dataQuestionList[i].choice3) {
                        setData = {
                          answer: 3,
                          choice: this.dataQuestionList[i].choice3
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }
                      if (this.dataQuestionList[i].choice4) {
                        setData = {
                          answer: 4,
                          choice: this.dataQuestionList[i].choice4
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }

                      if (this.dataQuestionList[i].answer1URL) {
                        setData = {
                          answer: 1,
                          choice: this.dataQuestionList[i].answer1URL
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }

                      if (this.dataQuestionList[i].answer2URL) {
                        setData = {
                          answer: 2,
                          choice: this.dataQuestionList[i].answer2URL
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }

                      if (this.dataQuestionList[i].answer3URL) {
                        setData = {
                          answer: 3,
                          choice: this.dataQuestionList[i].answer3URL
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }

                      if (this.dataQuestionList[i].answer4URL) {
                        setData = {
                          answer: 4,
                          choice: this.dataQuestionList[i].answer4URL
                        };

                        dataAnswerArr[choiceNumber].push(setData);
                      }

                      dataAnswerArr[choiceNumber].sort(() => {
                        return 0.5 - Math.random();
                      });

                      this.dataChoiceList.push(dataAnswerArr[choiceNumber]);
                    }
                  }

                  this.isLoadData = false;
                }

                let data = {
                  academicKey: this.student.year,
                  practiceKey: this.$q.localStorage.getItem("practiceKey"),
                  practiceType: this.$q.localStorage.getItem("practiceType"),
                  section: Number(setSection[0]),
                  room: this.student.room,
                  schoolCode: this.student.schoolCode,
                  studentKey: this.student.key,
                  studentName: this.student.name + " " + this.student.surname,
                  studentNo: this.student.no,
                  currentQuestion: this.currentQuestion,
                  dataAnswerList: this.dataAnswerList,
                  dataAnswerCurrent: this.dataAnswerCurrent,
                  scoreRaw: 0,
                  status: false,
                  checkScore: false,
                  scorePercent: 0
                };
                db.collection("studentScoreLog")
                  .add(data)
                  .then(getKey => {
                    this.dataQuestionKey = getKey.id;
                  });
              });
          }
        });
    },
    loadSnap() {
      this.dataSnapshot = db
        .collection("Synchronize")
        .where("academicKey", "==", this.student.year)
        .where("currentTeachRoom", "==", this.student.room)
        .where("schoolcode", "==", this.student.schoolCode)
        .where(
          "studyplanKey",
          "==",
          this.$q.localStorage.getItem("practiceKey")
        )
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          if (doc.size > 0) {
            if (doc.docs[0].data().practiceType == "คำสั่ง") {
              this.isSteps = 0;
            } else if (doc.docs[0].data().practiceType == "ทดสอบ") {
              this.isSteps = 1;
            } else if (doc.docs[0].data().practiceType == "กราฟสรุป") {
              this.isSteps = 2;
            } else if (doc.docs[0].data().practiceType == "เฉลย") {
              this.isSteps = 4;
            }
          } else {
            this.dataSnapshot();
          }
        });
    }
  },
  mounted() {
    let practiceKey = this.$q.localStorage.getItem("practiceKey");
    let setSection = this.$q.localStorage.getItem("section").split("-");
    this.section = setSection[0] + " - " + setSection[1];

    if (practiceKey) {
      this.loadQuestion();
      this.loadSnap();
    }
  }
};
</script>


<style scoped>
.me-scrollbar {
  height: fit-content;
  min-height: calc(100vh - 400px);
}

.animated {
  animation-duration: 0.5s;
}
</style>