<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-pa-sm" v-if="$q.platform.is.desktop">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h6 text-bold">ข้อสอบ</span>
        </div>
      </div>
      <div class="bg8 q-pt-xs borders1-sm borders-rb q-mx-sm" align="center">
        <!-- SECTION  Waiting Other -->
        <div v-if="isSteps == 0">
          <waiting :setType="'waitexam'"></waiting>
        </div>
        <div v-if="isSteps == 2">
          <waiting :setType="'waitfriend'"></waiting>
        </div>
        <div v-if="isSteps == 3">
          <waiting :setType="'waiting'"></waiting>
        </div>

        <div>
          <!-- SECTION  1 -->
          <div v-if="isSteps == 1" class="q-px-sm animated fadeIn">
            <div class="row q-my-lg q-px-xs text-white text-bold">
              <div class="col-7">
                <q-spinner-dots class="color10 q-mt-xl" v-if="!isLoadFilePdf" size="100px" />
                <div class="relative-position fit" v-if="isLoadFilePdf">
                  <iframe
                    :src="dataQuestionURL + '#toolbar=0&navpanes=0&scrollbar=0'"
                    style="width:100%;height:100%;"
                  ></iframe>
                </div>
              </div>

              <div class="col me-exam-scrollbar" style="padding:0px 10px;">
                <div class="bg10 q-pa-sm" style="border-radius:3px 3px 0px 0px;">
                  <span class="text-h6 text-bold color1">รหัสชุดข้อสอบวิชาภาษาอังกฤษ</span>
                </div>
                <div>
                  <div class="row">
                    <div class="col" v-for="(item,index) in dataExamSetList" :key="index">
                      <div class="bg2 text-h6 color1">
                        <div
                          align="center"
                          class="q-pa-xs"
                          :class="{'me-border-right':index != dataExamSetList.length - 1}"
                        >
                          <q-btn
                            :class="{'no-pointer-events':isExamSet}"
                            flat
                            dense
                            round
                            class="q-mr-sm"
                            @click="examSetBtn(item)"
                            :disabled="dataExamList.length == 0"
                          >
                            <span class="text-h5">
                              <span v-if="dataExamSet != item" class="far fa-circle"></span>
                              <span v-if="dataExamSet == item" class="fas fa-circle"></span>
                            </span>
                          </q-btn>
                          <span>{{item}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <!-- กรณีชุดข้อสอบไม่ตรงกับที่นักเรียนเลือก -->
                    <div
                      class="col-12 q-pa-md"
                      style="margin-top:150px;"
                      v-if="isNotHasExamSet"
                      align="center"
                    >
                      <span class="text-h5 color1">รหัสชุดข้อสอบไม่ถูกต้อง</span>
                    </div>

                    <div align="center" class="col-12 q-pa-sm bg9" v-show="isExamSet">
                      <span class="text-h6 color1">กระดาษคำตอบ</span>
                    </div>
                    <div class="col-12" v-show="isExamSet">
                      <table class="me-table">
                        <tr
                          v-for="(item,index) in dataExamList"
                          :key="index"
                          :class="{'bg9':(index+1)%2 == 0}"
                        >
                          <td style="width:40px;" align="center">
                            <span class="text-h6 color1">{{index + 1}}.</span>
                          </td>
                          <td align="center" style="padding:13px 0px;">
                            <q-btn
                              dense
                              round
                              size="15px"
                              class="borders1-sm q-ma-xs"
                              :class="{'bg1 text-white':dataAnswerList[index].answer == 1,'bg2 color1':dataAnswerList[index].answer != 1}"
                              @click="answerBtn(1,index)"
                              :disabled="isSaveData"
                            >1</q-btn>
                          </td>
                          <td align="center" style="padding:13px 0px;">
                            <q-btn
                              dense
                              round
                              size="15px"
                              class="borders1-sm q-ma-xs"
                              :class="{'bg1 text-white':dataAnswerList[index].answer == 2,'bg2 color1':dataAnswerList[index].answer != 2}"
                              @click="answerBtn(2,index)"
                              :disabled="isSaveData"
                            >2</q-btn>
                          </td>
                          <td align="center" style="padding:13px 0px;">
                            <q-btn
                              dense
                              round
                              size="15px"
                              class="borders1-sm q-ma-xs"
                              :class="{'bg1 text-white':dataAnswerList[index].answer == 3,'bg2 color1':dataAnswerList[index].answer != 3}"
                              @click="answerBtn(3,index)"
                              :disabled="isSaveData"
                            >3</q-btn>
                          </td>
                          <td align="center" style="padding:13px 0px;">
                            <q-btn
                              dense
                              round
                              size="15px"
                              class="borders1-sm q-ma-xs"
                              :class="{'bg1 text-white':dataAnswerList[index].answer == 4,'bg2 color1':dataAnswerList[index].answer != 4}"
                              @click="answerBtn(4,index)"
                              :disabled="isSaveData"
                            >4</q-btn>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12" v-if="isFinish">
                <div class="q-pt-lg">
                  <q-btn class="bg5 text-white" style="width:250px;" @click="isSteps = 2">ส่งคำตอบ</q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <pc></pc>
    </div>
  </q-page>
</template>

<script>
import { db } from "../../router/index.js";
import waiting from "../../components/waiting.vue";
import pc from "../../components/pleaseComputer.vue";
export default {
  components: {
    waiting,
    pc
  },
  data() {
    return {
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors: [],
      scale: "page-width",
      zoom: false,
      maximizedToggle: true,

      currentQuestion: 0,
      section: "", // เก็บข้อมูลคาบเรียน
      student: this.$q.localStorage.getItem("studentData"), // เก็บข้อมูลนักเรียน

      dataQuestionURL: "",

      dataExamKey: "",
      dataExamSet: 0,
      dataExamSetQuestion: 0,
      dataExamSetList: [100, 200, 300, 400],
      dataExamList: [],
      dataExamSize: 0,
      dataExamScore: 0,
      dataExamCorrect: 0,
      dataAnswerList: [],

      isSteps: 0,
      isExamSet: false,
      isNotHasExamSet: false,
      isSaveData: false, // เช็คข้อมูลการบันทึก
      isFinish: false, // แสดงปุ่มส่งคำตอบถ้าทำแบบฝึกหัดเสร็จทั้งหมด
      isLoadFilePdf: false
    };
  },
  methods: {
    nextBtn() {
      this.page++;
    },
    backBtn() {
      this.page--;
    },
    examSetBtn(set) {
      this.dataExamSet = set;

      if (set != this.dataExamSetQuestion) {
        this.isNotHasExamSet = true;
        return;
      }

      db.collection("studentScoreLog")
        .doc(this.dataExamKey)
        .update({
          examSet: set
        });

      this.isExamSet = true;
      this.isNotHasExamSet = false;
    },
    // กดตอบคำถาม
    answerBtn(answer, index) {
      this.isSaveData = true;

      let practiceKey = this.$q.localStorage.getItem("practiceKey");
      let finish = false;

      this.dataExamCorrect = 0;

      if (this.dataExamList[index].answer == answer) {
        this.dataAnswerList[index].status = "ถูก";
      } else {
        this.dataAnswerList[index].status = "ผิด";
      }

      if (this.dataAnswerList[index].answer == 0) {
        this.currentQuestion += 1;
      }

      this.dataAnswerList[index].answer = answer;

      for (let i = 0; i < this.dataAnswerList.length; i++) {
        if (this.dataAnswerList[i].status == "ถูก") {
          this.dataExamCorrect += 1;
        }
      }

      this.dataExamScore = (this.dataExamCorrect / this.dataExamSize) * 100;

      if (this.currentQuestion == this.dataExamSize) {
        this.isFinish = true;

        setTimeout(() => {
          document.documentElement.scrollTop =
            document.documentElement.scrollHeight;
        }, 300);

        finish = true;
      }

      db.collection("studentScoreLog")
        .doc(this.dataExamKey)
        .update({
          currentQuestion: this.currentQuestion,
          dataAnswerList: this.dataAnswerList,
          scoreRaw: this.dataExamCorrect,
          status: finish,
          scorePercent: this.dataExamScore
        });

      this.isSaveData = false;
    },

    // โหลดข้อมูลกระดาษคำตอบ
    async loadPractice() {
      let practiceKey = this.$q.localStorage.getItem("practiceKey");

      let data = await db
        .collection("StudyPlan")
        .doc(practiceKey)
        .get();

      this.dataExamSetQuestion = data.data().examSet;

      data = await db
        .collection("ExamPdf")
        .doc(practiceKey)
        .get();

      this.dataQuestionURL = data.data().questionURL;
      this.isLoadFilePdf = true;

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
            this.dataAnswerList = result.docs[0].data().dataAnswerList;
            this.currentQuestion = result.docs[0].data().currentQuestion;
            if (
              result.docs[0].data().dataAnswerList.length ==
              result.docs[0].data().currentQuestion
            ) {
              this.isSteps = 3;
              return;
            }

            let doc = await db
              .collection("Exam")
              .where("key", "==", practiceKey)
              .get();

            if (doc.size > 0) {
              this.dataExamSize = doc.size;

              this.dataExamKey = result.docs[0].id;
              this.dataExamSet = result.docs[0].data().examSet;
              this.dataExamScore = result.docs[0].data().scorePercent;

              if (this.dataExamSet == this.dataExamSetQuestion) {
                this.isExamSet = true;
              }

              for (let i = 0; i < this.dataAnswerList.length; i++) {
                if (this.dataAnswerList[i].status == "ถูก") {
                  this.dataExamCorrect += 1;
                }
              }

              this.dataExamScore =
                (this.dataExamCorrect / this.dataExamSize) * 100;

              doc.forEach(data => {
                this.dataExamList.push(data.data());
              });

              this.dataExamList.sort((a, b) => {
                return a.no - b.no;
              });
            }
          }

          // กรณีข้อมูลยังไม่มีข้อมูล
          else {
            let setSection = this.$q.localStorage.getItem("section").split("-");

            let doc = await db
              .collection("Exam")
              .where("key", "==", practiceKey)
              .get();

            if (doc.size > 0) {
              this.dataExamSize = doc.size;
              doc.forEach(data => {
                this.dataExamList.push(data.data());
              });

              this.dataExamList.sort((a, b) => {
                return a.no - b.no;
              });

              for (let i = 0; i < this.dataExamList.length; i++) {
                let dataAnswer = {
                  answer: 0,
                  status: "ผิด",
                  correctAnswer: this.dataExamList[i].answer
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
                examSet: 0,
                scorePercent: 0
              };

              db.collection("studentScoreLog")
                .add(data)
                .then(getKey => {
                  this.dataExamKey = getKey.id;
                });
            }
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
            if (doc.docs[0].data().practiceType == "คำสั่ง") {
              this.isSteps = 0;
            } else {
              this.isSteps = 1;
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
      this.loadPractice();
      this.loadSnap();
    }
  }
};
</script>

<style scoped>
.me-border-right {
  border-right: 2px solid #666666;
}

.me-exam-scrollbar {
  height: calc(100vh - 270px);
  overflow-y: auto;
}

/* width */
.me-exam-scrollbar::-webkit-scrollbar {
  width: 17px;
}

/* Track */
.me-exam-scrollbar::-webkit-scrollbar-track {
  background-color: #fce0c7;
  border: 5px solid #fff0e2;
  border-radius: 10px;
}

/* Handle */
.me-exam-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f59085;
  border-radius: 10px;
}

/* Handle on hover */
.me-exam-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #f88477;
}

.me-table {
  width: 100%;
  border-collapse: collapse;
}

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

#buttons {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* Page content */
.content {
  padding: 16px;
}
</style>