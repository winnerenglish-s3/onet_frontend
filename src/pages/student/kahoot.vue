<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-pa-md">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h6 text-bold">แบบฝึกหัด</span>
        </div>
      </div>

      <div class="bg8 q-pt-md borders1-sm borders-rb q-mx-sm" align="center">
        <!-- SECTION  2 -->
        <div v-if="isSteps == 0">
          <waiting :setType="'listen'"></waiting>
        </div>
        <div v-if="isSteps == 2">
          <waiting :setType="'waiting'"></waiting>
        </div>
        <div v-if="isSteps == 3">
          <waiting :setType="'waitfriend'"></waiting>
        </div>

        <!-- SECTION  1 -->
        <div v-if="isSteps == 1" class="q-pl-md q-pr-sm q-pt-lg animated fadeIn">
          <div class="row justify-center items-center me-scrollbar" v-if="!isLoadData">
            <q-spinner-dots class="color10" size="100px" />
          </div>
          <div v-if="isLoadData">
            <div class="row justify-center">
              <div :class="{'col-10':dataQuestionSize > 9,'col-8':dataQuestionSize < 6}">
                <div class="row borders1-md text-h6">
                  <div
                    class="col q-pa-xs text-blue-gery-10"
                    :class="{'borders1-r-md':index != dataQuestionList.length - 1,'bg7':teacherCurrentQuestion == index,'bg5 text-white':teacherCurrentQuestion > index}"
                    v-for="(item,index) in dataQuestionList"
                    :key="index"
                  >{{index + 1}}</div>
                </div>
              </div>
            </div>
            <div
              class="row q-my-lg q-px-xs text-white text-bold"
              v-if="dataQuestionList[teacherCurrentQuestion].type == 1"
            >
              <div class="col-md-6 col-xs-12 q-pa-md">
                <q-btn
                  size="80px"
                  class="bg10 q-pa-md borders-ra full-width"
                  @click="answerBtn(1)"
                  :disabled="isSaveData"
                >
                  <i class="fas fa-motorcycle"></i>
                </q-btn>
              </div>
              <div class="col-md-6 col-xs-12 q-pa-md">
                <q-btn
                  size="80px"
                  class="bg6 q-pa-md borders-ra full-width"
                  @click="answerBtn(2)"
                  :disabled="isSaveData"
                >
                  <i class="fas fa-car-side"></i>
                </q-btn>
              </div>
              <div class="col-md-6 col-xs-12 q-pa-md">
                <q-btn
                  size="80px"
                  class="bg4 q-pa-md borders-ra full-width"
                  @click="answerBtn(3)"
                  :disabled="isSaveData"
                >
                  <i class="fas fa-helicopter"></i>
                </q-btn>
              </div>
              <div class="col-md-6 col-xs-12 q-pa-md">
                <q-btn
                  size="80px"
                  class="bg7 q-pa-md borders-ra full-width"
                  @click="answerBtn(4)"
                  :disabled="isSaveData"
                >
                  <i class="fas fa-plane"></i>
                </q-btn>
              </div>
            </div>
            <div
              class="row q-my-lg q-px-xs text-white text-bold animated fadeIn"
              v-if="dataQuestionList[teacherCurrentQuestion].type == 2"
            >
              <div class="col-md-6 col-xs-12 bg9 q-py-xl q-px-md">
                <q-img
                  :src="dataQuestionList[teacherCurrentQuestion].questionURL"
                  style="max-width:450px;width:100%;"
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
                  <q-img :src="dataQuestionList[teacherCurrentQuestion].questionURL"></q-img>
                </q-dialog>
              </div>
              <div class="col-md-6 col-xs-12 q-px-md-md">
                <div class="row">
                  <div class="col-12 q-pt-md">
                    <q-btn
                      size="55px"
                      class="bg10 borders-ra full-width"
                      @click="answerBtn(1)"
                      :disabled="isSaveData"
                    >
                      <i class="fas fa-motorcycle"></i>
                    </q-btn>
                  </div>
                  <div class="col-12 q-pt-md">
                    <q-btn
                      size="55px"
                      class="bg6 borders-ra full-width"
                      @click="answerBtn(2)"
                      :disabled="isSaveData"
                    >
                      <i class="fas fa-car-side"></i>
                    </q-btn>
                  </div>
                  <div class="col-12 q-pt-md">
                    <q-btn
                      size="55px"
                      class="bg4 borders-ra full-width"
                      @click="answerBtn(3)"
                      :disabled="isSaveData"
                    >
                      <i class="fas fa-helicopter"></i>
                    </q-btn>
                  </div>
                  <div class="col-12 q-pt-md">
                    <q-btn
                      size="55px"
                      class="bg7 borders-ra full-width"
                      @click="answerBtn(4)"
                      :disabled="isSaveData"
                    >
                      <i class="fas fa-plane"></i>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3 -->
        <div v-if="isSteps == 4" class="animated fadeIn">
          <div
            class="row q-py-xl justify-center items-center me-scrollbar"
            v-if="dataQuestionList.length > 0"
          >
            <div
              class="col-md-6 col-xs-8 bg5 borders-ra text-white q-px-lg"
              v-if="dataAnswerList[teacherCurrentQuestion].answer == dataQuestionList[teacherCurrentQuestion].correctAnswer"
            >
              <div class="q-pa-xl">
                <span class="text-bold">
                  <q-icon name="fas fa-check" style="font-size:17vmax ;"></q-icon>
                </span>
                <div class="q-pb-lg text-h4 text-bold">ยินดีด้วยคุณตอบถูก</div>
              </div>
            </div>

            <div v-else class="col-md-6 col-xs-8 bg11 borders-ra text-white q-px-xl">
              <div class="q-pa-xl">
                <span class="text-bold">
                  <q-icon name="fas fa-times" style="font-size:17vmax ;"></q-icon>
                </span>
                <div class="q-pb-lg text-h4 text-bold">พยายามใหม่อีกครั้ง</div>
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
      teacherCurrentQuestion: 0,
      currentQuestion: 0,
      section: "", // เก็บข้อมูลคาบเรียน
      student: this.$q.localStorage.getItem("studentData"), // เก็บข้อมูลนักเรียน
      showImage: false,

      dataQuestionKey: "",
      dataQuestionList: [],
      dataQuestionSize: 0,
      dataAnswerList: [],
      dataAnswerCorrect: 0,
      dataAnswerScore: 0,

      isSteps: 0,
      isSaveData: false, // เช็คข้อมูลการบันทึก
      isFinish: false, // โชว์ปุ่มส่งคำตอบถ้าทำแบบฝึกหัดเสร็จทั้งหมด
      isLoadData: false
    };
  },
  methods: {
    // กดตอบคำถาม
    answerBtn(answer) {
      this.isSaveData = true;

      let practiceKey = this.$q.localStorage.getItem("practiceKey");
      let status;
      let finish = false;
      this.dataAnswerCorrect = 0;

      if (this.dataAnswerList[this.teacherCurrentQuestion].answer == 0) {
        this.currentQuestion += 1;
      }

      if (
        this.dataAnswerList[this.teacherCurrentQuestion].correctAnswer == answer
      ) {
        this.dataAnswerList[this.teacherCurrentQuestion].status = "ถูก";
      } else {
        this.dataAnswerList[this.teacherCurrentQuestion].status = "ผิด";
      }

      if (this.currentQuestion == this.dataAnswerList.length) {
        finish = true;
      }

      for (let i = 0; i < this.dataAnswerList.length; i++) {
        if (this.dataAnswerList[i].status == "ถูก") {
          this.dataAnswerCorrect += 1;
        }
      }

      this.dataAnswerScore =
        (this.dataAnswerCorrect / this.dataQuestionSize) * 100;

      this.dataAnswerList[this.teacherCurrentQuestion].answer = answer;

      db.collection("studentScoreLog")
        .doc(this.dataQuestionKey)
        .update({
          currentQuestion: this.currentQuestion,
          dataAnswerList: this.dataAnswerList,
          scoreRaw: this.dataAnswerCorrect,
          status: finish,
          scorePercent: this.dataAnswerScore
        })
        .then(() => {
          this.isSaveData = false;
          this.isSteps = 3;
        });
    },

    // โหลดข้อมูลกระดาษคำตอบ
    loadPractice() {
      this.isSaveData = true;
      let practiceKey = this.$q.localStorage.getItem("practiceKey");

      db.collection("studentScoreLog")
        .where("practiceKey", "==", practiceKey)
        .where("room", "==", this.student.room)
        .where("schoolCode", "==", this.student.schoolCode)
        .where("studentKey", "==", this.student.key)
        .where("academicKey", "==", this.student.year)
        .get()
        .then(async result => {
          // กรณีถ้าข้อมูลใน StudentScore มีข้อมูลอยู่แล้ว
          if (result.size > 0) {
            let doc = await db
              .collection("MultipleChoice")
              .doc("Server")
              .collection("data")
              .where("practiceKey", "==", practiceKey)
              .get();

            if (doc.size > 0) {
              this.dataQuestionSize = doc.size;
              let dataQuestionArr = [];

              this.dataAnswerList = result.docs[0].data().dataAnswerList;
              this.currentQuestion = result.docs[0].data().currentQuestion;
              this.dataQuestionKey = result.docs[0].id;
              this.dataAnswerScore = result.docs[0].data().scorePercent;

              for (let i = 0; i < this.dataAnswerList.length; i++) {
                if (this.dataAnswerList[i].status == "ถูก") {
                  this.dataAnswerCorrect += 1;
                }
              }

              doc.forEach(data => {
                // เก็บข้อมูลคำตอบ
                dataQuestionArr.push(data.data());
              });

              dataQuestionArr.sort((a, b) => {
                return a.orderId - b.orderId;
              });

              this.dataQuestionList = dataQuestionArr;

              this.isSaveData = false;
            }

            this.isLoadData = true;
          }

          // กรณีข้อมูลยังไม่มีข้อมูล
          else {
            let setSection = this.$q.localStorage.getItem("section").split("-");

            db.collection("MultipleChoice")
              .doc("Server")
              .collection("data")
              .where("practiceKey", "==", practiceKey)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.dataQuestionSize = doc.size;
                  let dataQuestionArr = [];
                  doc.forEach(data => {
                    // เก็บข้อมูลคำตอบ
                    dataQuestionArr.push(data.data());
                  });

                  dataQuestionArr.sort((a, b) => {
                    return a.orderId - b.orderId;
                  });

                  this.dataQuestionList = dataQuestionArr;

                  for (let i = 0; i < this.dataQuestionList.length; i++) {
                    let dataAnswer = {
                      answer: 0,
                      status: "ผิด",
                      correctAnswer: this.dataQuestionList[i].correctAnswer
                    };

                    this.dataAnswerList.push(dataAnswer);
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
                    dataAnswerList: this.dataAnswerList,
                    scoreRaw: 0,
                    currentQuestion: 0,
                    status: false,
                    checkScore: false,
                    scorePercent: 0
                  };

                  db.collection("studentScoreLog")
                    .add(data)
                    .then(getKey => {
                      this.dataQuestionKey = getKey.id;
                      this.isSaveData = false;

                      this.isLoadData = true;
                    });
                }
              });
          }
        });
    },
    loadSnap() {
      let practiceKey = this.$q.localStorage.getItem("practiceKey");
      this.dataSnapshot = db
        .collection("Synchronize")
        .where("academicKey", "==", this.student.year)
        .where("currentTeachRoom", "==", this.student.room)
        .where("schoolcode", "==", this.student.schoolCode)
        .where("studyplanKey", "==", practiceKey)
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          if (doc.size > 0) {
            this.teacherCurrentQuestion = doc.docs[0].data().currentQuestion;

            if (doc.docs[0].data().practiceType == "คำสั่ง") {
              this.isSteps = 0;
            } else if (doc.docs[0].data().practiceType == "ทำแบบฝึกหัด") {
              if (this.dataQuestionList.length == 0) {
                this.loadPractice();
              }
              this.isSteps = 1;
            } else if (doc.docs[0].data().practiceType == "กราฟสรุป") {
              if (this.dataQuestionList.length == 0) {
                this.loadPractice();
              }
              this.isSteps = 2;
            } else if (doc.docs[0].data().practiceType == "เฉลย") {
              if (this.dataQuestionList.length == 0) {
                this.loadPractice();
              }
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
      this.loadSnap();
    }
  }
};
</script>

<style scoped>
.me-scrollbar {
  height: fit-content;
  min-height: calc(100vh - 280px);
}
/* width */
.me-scrollbar::-webkit-scrollbar {
  width: 15px;
}

/* Track */
.me-scrollbar::-webkit-scrollbar-track {
  background-color: #fce0c7;
  border: 4px solid #fff0e2;
  border-radius: 10px;
}

/* Handle */
.me-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f59085;
  border-radius: 10px;
}

/* Handle on hover */
.me-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #f88477;
}
</style>