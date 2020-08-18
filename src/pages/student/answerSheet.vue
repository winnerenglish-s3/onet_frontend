<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <q-resize-observer @resize="onResize" />
    <div class="maindiv q-pa-md-md animated zoomIn">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1">
            <span class="text-h5" v-if="innerWidth > 640">ส่งการบ้าน | {{section}}</span>
            <span
              class="text-h6"
              v-if="innerWidth < 641"
            >{{"ส่งการบ้าน | คาบเรียนที่ " + sectionNumber}}</span>
          </span>
        </div>
      </div>
      <div class="bg8 q-pt-lg borders1-sm borders-rb q-mx-sm q-pr-sm" align="center">
        <div
          class="row justify-center items-center me-scrollbar"
          v-if="!isLoadData && isSteps == 0"
        >
          <q-spinner-dots class="color10" size="100px" />
        </div>
        <!-- SECTION  Waiting Other -->
        <div
          class="row justify-center items-center me-scrollbar"
          align="center"
          v-if="isSteps == 1"
        >
          <waiting :setType="'waitfriend'"></waiting>
        </div>
        <div
          class="row justify-center items-center me-scrollbar"
          align="center"
          v-if="isSteps == 2"
        >
          <waiting :setType="'waiting'"></waiting>
        </div>

        <div
          class="q-pl-md-md q-pl-xs-sm q-pr-md-sm q-pt-lg me-scrollbar"
          v-if="isLoadData && isSteps == 0"
        >
          <table style="width:100%;">
            <tr
              v-for="(item,index) in dataAnswerList"
              :key="index"
              :class="{'bgtr':index%2 == 0,'bg9':index%2 != 0}"
            >
              <td style="width:80px;" align="center">
                <span>{{index + 1}}</span>
              </td>
              <td align="center">
                <div class="row q-pa-xs">
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      @click="answerBtn(index,1)"
                      class="borders1-xs"
                      :class="{'bg1 text-white':item.answer == 1,'bg8':item.answer != 1}"
                      dense
                      flat
                      round
                      :disabled="isSaveData"
                    >1</q-btn>
                  </div>
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      @click="answerBtn(index,2)"
                      class="borders1-xs"
                      :class="{'bg1 text-white':item.answer == 2,'bg8':item.answer != 2}"
                      dense
                      flat
                      round
                      :disabled="isSaveData"
                    >2</q-btn>
                  </div>
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      @click="answerBtn(index,3)"
                      class="borders1-xs"
                      :class="{'bg1 text-white':item.answer == 3,'bg8':item.answer != 3}"
                      dense
                      flat
                      round
                      :disabled="isSaveData"
                    >3</q-btn>
                  </div>
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      @click="answerBtn(index,4)"
                      class="borders1-xs"
                      :class="{'bg1 text-white':item.answer == 4,'bg8':item.answer != 4}"
                      dense
                      flatf
                      round
                      :disabled="isSaveData"
                    >4</q-btn>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="q-pa-md bg8" align="center" style="position:sticky;bottom:0;">
          <q-btn
            v-if="isFinish"
            class="bg5 text-white"
            style="width:250px;"
            @click="sendBtn()"
          >ส่งคำตอบ</q-btn>
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
      section: "", // เก็บข้อมูลคาบเรียน
      sectionNumber: "",
      student: this.$q.localStorage.getItem("studentData"), // เก็บข้อมูลนักเรียน

      currentQuestion: 0,
      dataQuestionKey: "",
      dataQuestionList: [], // ข้อมูลกระดาษคำตอบ
      dataAnswerList: [], // เก็บข้อมูลที่เด็กตอบ
      dataAnswerCorrect: 0,
      dataAnswerScore: 0,
      dataQuestionSize: 0, // จำนวนข้อ

      isSteps: 0,
      isSaveData: false, // เช็คข้อมูลการบันทึก
      isFinish: false, // โชว์ปุ่มส่งคำตอบถ้าทำแบบฝึกหัดเสร็จทั้งหมด
      isLoadData: false,

      innerWidth: window.InnerWidth,
      innerHeight: window.InnerHeight
    };
  },
  methods: {
    // ปุ่มส่งคำตอบ
    sendBtn() {
      this.isSteps = 1;
      this.isFinish = false;
    },

    // ปุ่มกดตอบ
    answerBtn(index, answer) {
      this.isSaveData = true;
      let finishData = false;

      let practiceKey = this.$q.localStorage.getItem("practiceKey");

      this.dataAnswerCorrect = 0;

      // เช็คคำตอบถูก หรือ ผิด
      if (answer == this.dataQuestionList[index].answer) {
        this.dataAnswerList[index].status = "ถูก";
      } else {
        this.dataAnswerList[index].status = "ผิด";
      }

      // เช็คว่าตอบครบทุกข้อไหม
      if (this.dataAnswerList[index].answer == 0) {
        this.currentQuestion += 1;
      }

      // เพิ่มคำตอบเข้าใน Array
      this.dataAnswerList[index].answer = answer;

      for (let i = 0; i < this.dataAnswerList.length; i++) {
        if (this.dataAnswerList[i].status == "ถูก") {
          this.dataAnswerCorrect += 1;
        }
      }

      this.dataAnswerScore =
        (this.dataAnswerCorrect / this.dataQuestionSize) * 100;

      if (this.currentQuestion == this.dataQuestionSize) {
        // โชว์ปุ่มส่งคำตอบ
        this.isFinish = true;
        // เก็บข้อมูลตอบครบทุกข้อให้เป็น True
        finishData = true;
      }

      db.collection("studentScoreLog")
        .doc(this.dataQuestionKey)
        .update({
          currentQuestion: this.currentQuestion,
          dataAnswerList: this.dataAnswerList,
          scoreRaw: this.dataAnswerCorrect,
          status: finishData,
          scorePercent: this.dataAnswerScore
        })
        .then(() => {
          this.isSaveData = false;
        });
    },

    // โหลดข้อมูลกระดาษคำตอบ
    loadPractice() {
      let practiceKey = this.$q.localStorage.getItem("practiceKey");

      this.isSaveData = true;

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
            this.dataQuestionKey = result.docs[0].id;
            this.dataAnswerList = result.docs[0].data().dataAnswerList;
            this.currentQuestion = result.docs[0].data().currentQuestion;

            this.dataAnswerScore = result.docs[0].data().scorePercent;

            for (let i = 0; i < this.dataAnswerList.length; i++) {
              if (this.dataAnswerList[i].status == "ถูก") {
                this.dataAnswerCorrect += 1;
              }
            }

            let doc = await db
              .collection("AnswerSheet")
              .where("key", "==", practiceKey)
              .get();

            if (doc.size > 0) {
              this.dataQuestionSize = doc.size;

              // เช็คข้อมูลถ้าตอบครบทุกข้อ
              if (this.currentQuestion == this.dataQuestionSize) {
                // โชว์ปุ่มส่งคำตอบ
                this.isSteps = 2;
              }

              doc.forEach(data => {
                // ข้อมูลในกระดาษคำตอบใน database
                this.dataQuestionList.push(data.data());
              });

              // เรียงข้อมูล
              this.dataQuestionList.sort((a, b) => {
                return a.no - b.no;
              });

              this.isLoadData = true;
              this.isSaveData = false;
            }
          }

          // กรณีข้อมูลยังไม่มีข้อมูล
          else {
            let setSection = this.$q.localStorage.getItem("section").split("-");

            db.collection("AnswerSheet")
              .where("key", "==", practiceKey)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.dataQuestionSize = doc.size;
                  doc.forEach(data => {
                    // ข้อมูลในกระดาษคำตอบใน database
                    this.dataQuestionList.push(data.data());
                  });

                  // เรียงข้อมูล
                  this.dataQuestionList.sort((a, b) => {
                    return a.no - b.no;
                  });

                  for (let i = 0; i < this.dataQuestionList.length; i++) {
                    // set Answer
                    let setAnswer = {
                      answer: 0,
                      correctAnswer: this.dataQuestionList[i].answer,
                      status: "ผิด"
                    };
                    this.dataAnswerList.push(setAnswer);
                  }

                  let data = {
                    studentKey: this.student.key,
                    practiceKey: this.$q.localStorage.getItem("practiceKey"),
                    practiceType: this.$q.localStorage.getItem("practiceType"),
                    section: Number(setSection[0]),
                    currentQuestion: this.currentQuestion,
                    dataAnswerList: this.dataAnswerList,
                    scoreRaw: 0,
                    room: this.student.room,
                    status: false,
                    checkScore: false,
                    schoolCode: this.student.schoolCode,
                    studentName: this.student.name + " " + this.student.surname,
                    studentNo: this.student.no,
                    academicKey: this.student.year,
                    scorePercent: 0
                  };

                  db.collection("studentScoreLog")
                    .add(data)
                    .then(getKey => {
                      this.dataQuestionKey = getKey.id;
                      this.isLoadData = true;
                      this.isSaveData = false;
                    });
                }
              });
          }
        });
    },
    onResize(size) {
      (this.innerWidth = size.width), (this.innerHeight = size.height);
    }
  },
  mounted() {
    let practiceKey = this.$q.localStorage.getItem("practiceKey");
    let setSection = this.$q.localStorage.getItem("section").split("-");
    this.section = setSection[0] + " - " + setSection[1];
    this.sectionNumber = setSection[0];

    if (practiceKey) {
      this.loadPractice();
    }
  }
};
</script>

<style scoped>
.me-scrollbar {
  height: fit-content;
  min-height: calc(100vh - 280px);
  overflow-y: auto;
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

.bgtr {
  background-color: #ddcdb9;
}

.animated {
  animation-duration: 0.6s;
}
</style>