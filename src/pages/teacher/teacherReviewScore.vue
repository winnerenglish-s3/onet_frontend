<template>
  <div>
    <teacher-bar :isShowBackBtn="true" :backtopagename="'/teacherRanking'"></teacher-bar>
    <div class="maindiv" style="margin:auto">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">ตารางคะแนนเก็บนักเรียน</div>
      </div>
      <!-- Content -->
      <div
        class="bg8 q-py-lg print-hide"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div class="q-pa-md row justify-center">
          <div class="col-7" align="center">
            <table style="width:80%;margin:auto">
              <tr>
                <td style="width:150px">ชั้น/ห้อง</td>
                <td style="width:150px">
                  <q-select
                    map-options
                    emit-value
                    :options="classroomOptions"
                    v-model="classroomSelected"
                    borderless
                    class="bg2 q-px-md"
                    style="border:1px solid;border-radius:5px;height:40px"
                  ></q-select>
                </td>
              </tr>
              <tr>
                <td>คาบเรียน</td>
                <td>
                  <q-select
                    map-options
                    emit-value
                    :options="sectionOptions"
                    v-model="sectionSelected"
                    class="bg2 q-px-md"
                    style="border:1px solid;border-radius:5px;height:40px"
                    borderless
                  ></q-select>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="q-pt-xl row justify-center">
          <div class="row col-6" align="center">
            <div class="col-md-6 col-xs-12">
              <q-btn
                push
                label="ย้อนกลับ"
                style="width:200px"
                class="bg2 color1"
                @click="previousPage()"
              ></q-btn>
            </div>
            <div class="col-md-6 col-xs-12">
              <q-btn push label="ตกลง" style="width:200px" class="bg5 color2" @click="printScore()"></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import { db } from "../../router/index.js";
import teacherBar from "../../components/teacherappbar.vue";
export default {
  components: {
    teacherBar
  },
  data() {
    return {
      classroomOptions: [],
      classroomSelected: "",
      teacherData: this.$q.localStorage.getItem("teacherData"),
      sectionOptions: [],
      sectionSelected: 0,
      studentScoreData: []
    };
  },
  methods: {
    previousPage() {
      this.$router.push("/teacherRanking");
    },
    async printScore() {
      this.showLoading();
      let printSection;
      let academicKey = await this.getAcademicYear();
      let studentData = [];
      let loadStudent = await db
        .collection("Student")
        .where("schoolCode", "==", this.teacherData.school)
        .where("year", "==", academicKey)
        .where("room", "==", this.classroomSelected)
        .get();
      loadStudent.forEach(stuDoc => {
        let dataKey = { key: stuDoc.id };
        let dataFinal = { ...dataKey, ...stuDoc.data() };
        studentData.push(dataFinal);
      });
      studentData.sort((a, b) => {
        return a.no - b.no;
      });
      let sectionNumber = this.sectionSelected + 1;
      printSection = "ครั้งที่ " + sectionNumber;
      for (const item of studentData) {
        let studentKey = item.key;
        let scoreTemp = 0;
        let scoreLog = await db
          .collection("reviewScore")
          .doc(studentKey)
          .get();
        if (scoreLog.exists) {
          scoreTemp = scoreLog.data().score[this.sectionSelected];
        } else {
          scoreTemp = 0;
        }
        if (scoreTemp >= 40) {
          scoreTemp = 3;
        } else if (scoreTemp >= 20) {
          scoreTemp = 2;
        } else if (scoreTemp >= 10) {
          scoreTemp = 1;
        } else {
          scoreTemp = 0;
        }
        let dataStudent = {
          score: scoreTemp,
          name: item.name + " " + item.surname,
          no: item.no
        };
        this.studentScoreData.push(dataStudent);
      }
      db.collection("Synchronize")
        .doc(this.teacherData.key)
        .collection("ShowScore")
        .doc("score")
        .set({ show: this.studentScoreData, type: "reviewScore" })
        .then(() => {
          db.collection("Synchronize")
            .doc(this.teacherData.key)
            .update({
              studyplanType: "showScore",
              studyplanKey: "showScore"
            })
            .then(() => {
              this.$router.push({
                name: "printScore",
                params: {
                  data: this.studentScoreData,
                  room: this.classroomSelected,
                  section: printSection,
                  scoreType: "คะแนนทบทวน",
                  fullScore: this.score
                }
              });
            });
        });
      this.hideLoading();
    },
    async getClassroom() {
      this.showLoading();
      let getTime = await axios.get(
        "https://api.winner-english.com/data/api/gettime.php"
      );
      getTime = getTime.data[0]["date"];
      getTime = getTime.split("/");
      let currentYear = getTime[2];
      currentYear = Number(currentYear) + 543;
      let currentMonth = getTime[1];
      currentYear =
        currentMonth >= 1 && currentMonth <= 4 ? currentYear - 1 : currentYear;
      db.collection("AcademicYear")
        .where("academicYear", "==", currentYear)
        .where("school", "==", this.teacherData.school)
        .get()
        .then(doc => {
          if (doc.size) {
            let totalRoom = doc.docs[0].data().roomAmount;
            for (let i = 1; i <= totalRoom; i++) {
              this.classroomOptions.push({
                label: "ป.6/" + i,
                value: "ป.6/" + i
              });
            }
            this.classroomSelected = this.classroomOptions[0].value;
          }
          this.countSection();
        });
    },
    async countSection() {
      let sectionCount = await db
        .collection("Section")
        .orderBy("orderId")
        .get();
      let counterSection = 0;
      let sectionTemp = [];
      sectionCount.forEach(element => {
        let dataSection = {
          label: counterSection + 1 + "-" + element.data().name,
          value: counterSection
        };
        sectionTemp.push(dataSection);
        counterSection++;
      });
      this.sectionOptions = sectionTemp;
      this.hideLoading();
    },
    async synchro() {
      let microTime = await this.getTime();
      db.collection("Synchronize")
        .doc(this.$q.localStorage.getItem("teacherData").key)
        .update({
          activetime: microTime,
          studyplanKey: "studyplan",
          studyplanType: "studyplan"
        });
    }
  },

  mounted() {
    this.checkTeacherPermission();
    this.synchro();
    this.getClassroom();
  }
};
</script>

<style>
.duration-flash {
  animation-duration: 2s;
}
</style>