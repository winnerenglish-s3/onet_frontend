<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-pa-sm">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h6 text-bold">เฉลยข้อสอบ</span>
        </div>
      </div>
      <div class="bg8 q-pt-xs borders1-sm borders-rb q-mx-sm" align="center">
        <div class="row justify-center items-center me-scrollbar" v-if="!isLoadData">
          <q-spinner-dots class="color10" size="100px"></q-spinner-dots>
        </div>
        <div v-if="isLoadData">
          <div class="q-px-sm q-pb-lg animated fadeIn">
            <div class="row q-mt-lg q-px-xs text-white text-bold">
              <div class="col-12 bg10 q-pa-sm" style="border-radius:3px 3px 0px 0px;">
                <span class="text-h6 text-bold color1">รหัสชุดข้อสอบวิชาภาษาอังกฤษ</span>
              </div>
            </div>
            <div class="row">
              <div class="col" v-for="(item,index) in dataExamSetList" :key="index">
                <div class="bg2 text-h6 color1">
                  <div
                    align="center"
                    class="q-pa-xs"
                    :class="{'me-border-right':index != dataExamSetList.length - 1}"
                  >
                    <span class="text-h5">
                      <span v-if="dataExamSet != item" class="far fa-circle q-pr-sm"></span>
                      <span v-if="dataExamSet == item" class="fas fa-circle q-pr-sm"></span>
                    </span>
                    <span>{{item}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div align="center" class="col-12 q-pa-sm bg9">
                <span class="text-h6 color1">กระดาษคำตอบ</span>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <table class="me-table">
                  <tr
                    v-for="(item,index) in dataExamList"
                    :key="index"
                    :class="{'bg9':(index+1)%2 == 0}"
                  >
                    <td style="width:60px;" align="center">
                      <span class="text-h6 color1">{{index + 1}}.</span>
                    </td>
                    <td align="center" style="padding:13px 0px;">
                      <q-btn
                        dense
                        round
                        size="15px"
                        class="borders1-sm no-pointer-events"
                        :class="{'bg1 text-white':dataAnswerList[index].answer == 1,'bg2 color1':dataAnswerList[index].answer != 1}"
                      >1</q-btn>
                    </td>
                    <td align="center" style="padding:13px 0px;">
                      <q-btn
                        dense
                        round
                        size="15px"
                        class="borders1-sm no-pointer-events"
                        :class="{'bg1 text-white':dataAnswerList[index].answer == 2,'bg2 color1':dataAnswerList[index].answer != 2}"
                      >2</q-btn>
                    </td>
                    <td align="center" style="padding:13px 0px;">
                      <q-btn
                        dense
                        round
                        size="15px"
                        class="borders1-sm no-pointer-events"
                        :class="{'bg1 text-white':dataAnswerList[index].answer == 3,'bg2 color1':dataAnswerList[index].answer != 3}"
                      >3</q-btn>
                    </td>
                    <td align="center" style="padding:13px 0px;">
                      <q-btn
                        dense
                        round
                        size="15px"
                        class="borders1-sm no-pointer-events"
                        :class="{'bg1 text-white':dataAnswerList[index].answer == 4,'bg2 color1':dataAnswerList[index].answer != 4}"
                      >4</q-btn>
                    </td>
                    <td style="width:150px;" align="center">
                      <span class="text-h4">
                        <span
                          v-show="dataAnswerList[index].status == 'ถูก'"
                          class="fas fa-check color5"
                        ></span>
                        <span
                          v-show="dataAnswerList[index].status == 'ผิด'"
                          class="fas fa-times color11"
                        ></span>
                      </span>
                    </td>
                  </tr>
                </table>
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

      dataExamSet: 0,
      dataExamSetList: [100, 200, 300, 400],
      dataExamList: [],
      dataExamSize: 0,
      dataAnswerList: [],

      isSaveData: false, // เช็คข้อมูลการบันทึก
      isFinish: false, // แสดงปุ่มส่งคำตอบถ้าทำแบบฝึกหัดเสร็จทั้งหมด
      isLoadData: false
    };
  },
  methods: {
    // โหลดข้อมูลกระดาษคำตอบ
    loadPractice() {
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
            this.dataAnswerList = result.docs[0].data().dataAnswerList;

            let data = await db
              .collection("StudyPlan")
              .doc(practiceKey)
              .get();

            this.dataExamSet = data.data().examSet;

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

              this.isLoadData = true;
            }
          }

          // กรณีข้อมูลยังไม่มีข้อมูล
          else {
            let data = await db
              .collection("StudyPlan")
              .doc(practiceKey)
              .get();

            this.dataExamSet = data.data().examSet;

            let doc = await db
              .collection("Exam")
              .where("key", "==", practiceKey)
              .get();

            if (doc.size > 0) {
              this.dataExamSize = doc.size;

              doc.forEach(data => {
                let dataAnswer = {
                  answer: 0,
                  status: "ผิด",
                  correctAnswer: 0
                };

                this.dataAnswerList.push(dataAnswer);

                this.dataExamList.push(data.data());
              });

              this.dataExamList.sort((a, b) => {
                return a.no - b.no;
              });

              this.isLoadData = true;
            }
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
</style>