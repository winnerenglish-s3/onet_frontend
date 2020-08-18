<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-pa-md">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h5">เฉลยการบ้าน | {{section}}</span>
        </div>
      </div>
      <div class="bg8 q-pt-lg borders1-sm borders-rb q-mx-sm q-pr-sm" align="center">
        <div class="q-pl-md q-pr-sm q-pt-lg me-scrollbar">
          <table style="width:100%;">
            <tr v-for="(item,index) in dataAnswerList" :key="index">
              <td style="width:120px;" class="bg9" align="center">
                <span>{{index + 1}}</span>
              </td>
              <td class="bg9" align="center">
                <div class="row q-pa-xs">
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      class="borders1-xs no-pointer-events"
                      :class="{'bg5 text-white':dataCurrentAnswer[index].answer == 1 && answerArray.includes(index),'bg1 text-white':dataAnswerList[index].answer == 1}"
                      dense
                      flat
                      round
                    >1</q-btn>
                  </div>
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      class="borders1-xs no-pointer-events"
                      :class="{'bg5 text-white':dataCurrentAnswer[index].answer == 2 && answerArray.includes(index),'bg1 text-white':dataAnswerList[index].answer == 2}"
                      dense
                      flat
                      round
                    >2</q-btn>
                  </div>
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      class="borders1-xs no-pointer-events"
                      :class="{'bg5 text-white':dataCurrentAnswer[index].answer == 3 && answerArray.includes(index),'bg1 text-white':dataAnswerList[index].answer == 3}"
                      dense
                      flat
                      round
                    >3</q-btn>
                  </div>
                  <div class="col-3 q-pa-xs">
                    <q-btn
                      class="borders1-xs no-pointer-events"
                      :class="{'bg5 text-white':dataCurrentAnswer[index].answer == 4 && answerArray.includes(index),'bg1 text-white':dataAnswerList[index].answer == 4}"
                      dense
                      flat
                      round
                    >4</q-btn>
                  </div>
                </div>
              </td>
              <td style="width:100px;" class="bg9" align="center">
                <span class="text-bold text-h4" v-if="answerArray.includes(index)">
                  <span class="fas fa-check color5" v-if="dataAnswerList[index].status == 'ถูก'"></span>
                  <span class="fas fa-times color11" v-if="dataAnswerList[index].status == 'ผิด'"></span>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../../router/index.js";
export default {
  data() {
    return {
      section: this.$q.localStorage.getItem("section"), // เก็บข้อมูลคาบเรียน
      student: this.$q.localStorage.getItem("studentData"), // เก็บข้อมูลนักเรียน
      answerArray: [],
      dataAnswerList: [], // เก็บข้อมูลที่เด็กตอบ
      dataCurrentAnswer: [],
      dataAnswerSize: 0
    };
  },
  methods: {
    // โหลดข้อมูลกระดาษคำตอบ
    loadPractice() {
      this.showLoading();

      let practiceKey = this.$q.localStorage.getItem("practiceKey");
      db.collection("studentScoreLog")
        .where("practiceKey", "==", practiceKey)
        .where("room", "==", this.student.room)
        .where("schoolCode", "==", this.student.schoolCode)
        .where("studentKey", "==", this.student.key)
        .where("academicKey", "==", this.student.year)
        .get()
        .then(result => {
          // กรณีถ้าข้อมูลใน StudentScore มีข้อมูลอยู่แล้ว
          if (result.size > 0) {
            db.collection("AnswerSheet")
              .where("key", "==", practiceKey)
              .get()
              .then(doc => {
                this.dataAnswerSize = doc.size;

                doc.forEach(data => {
                  // ข้อมูลในกระดาษคำตอบใน database
                  this.dataCurrentAnswer.push(data.data());
                });

                // เรียงข้อมูล
                this.dataCurrentAnswer.sort((a, b) => {
                  return a.no - b.no;
                });
                // ข้อมูลในกระดาษคำตอบใน database
                this.dataAnswerList = result.docs[0].data().dataAnswerList;

                // เรียงข้อมูล
                this.dataAnswerList.sort((a, b) => {
                  return a.no - b.no;
                });

                this.hideLoading();
              });
          }

          // กรณีข้อมูลยังไม่มีข้อมูล
          else {
            db.collection("AnswerSheet")
              .where("key", "==", practiceKey)
              .get()
              .then(doc => {
                this.dataAnswerSize = doc.size;
                doc.forEach(data => {
                  // ข้อมูลในกระดาษคำตอบใน database
                  this.dataCurrentAnswer.push(data.data());

                  // set Answer
                  let setAnswer = {
                    answer: 0,
                    correctAnswer: 0,
                    status: "ผิด"
                  };
                  this.dataAnswerList.push(setAnswer);
                });

                // เรียงข้อมูล
                this.dataCurrentAnswer.sort((a, b) => {
                  return a.no - b.no;
                });

                this.hideLoading();
              });
          }
        });
    },
    load() {
      let practiceKey = this.$q.localStorage.getItem("practiceKey");

      this.dataSnapshot = db
        .collection("Synchronize")
        .where("academicKey", "==", this.student.year)
        .where("currentTeachRoom", "==", this.student.room)
        .where("schoolcode", "==", this.student.schoolCode)
        .where("studyplanKey", "==", practiceKey)
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          if (doc.size > 0) {
            this.answerArray = doc.docs[0].data().answerArr;

            if (this.answerArray.length == this.dataAnswerList.length) {
              this.dataSnapshot(); // เคลียร์ Snapshot
            }
          }
        });
    }
  },
  mounted() {
    let practiceKey = this.$q.localStorage.getItem("practiceKey");

    if (practiceKey) {
      this.load();
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
</style>