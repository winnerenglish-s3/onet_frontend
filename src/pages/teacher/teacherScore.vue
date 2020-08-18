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
          <div class="col-7">
            <table style="width:100%">
              <tr>
                <td style="width:100px">ชั้น/ห้อง</td>
                <td style="width:120px"></td>
                <td style="width:120px">
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
                <td style="width:50px"></td>
                <td style="width:120px"></td>
                <td></td>
              </tr>
              <tr>
                <td>คาบเรียน</td>
                <td>
                  <q-radio
                    v-model="classroomRadio"
                    val="1"
                    label="คาบที่"
                    @input="changeRadioType()"
                  ></q-radio>
                </td>
                <td>
                  <q-select
                    map-options
                    emit-value
                    :disable="classroomRadio != 1"
                    :options="sectionOptions"
                    v-model="sectionSelected"
                    class="bg2 q-px-md"
                    style="border:1px solid;border-radius:5px;height:40px"
                    borderless
                  ></q-select>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr v-show="sectionOptionsTemp.length > 2">
                <td></td>
                <td>
                  <q-radio
                    v-model="classroomRadio"
                    val="2"
                    label="คาบที่"
                    @input="changeRadioType()"
                  ></q-radio>
                </td>
                <td>
                  <q-select
                    map-options
                    emit-value
                    :disable="classroomRadio != 2"
                    :options="sectionOptionsTemp"
                    v-model="presectionSelected"
                    @input="changePreSection()"
                    class="bg2 q-px-md"
                    style="border:1px solid;border-radius:5px;height:40px"
                    borderless
                  ></q-select>
                </td>
                <td align="center">ถึง</td>
                <td>
                  <q-select
                    map-options
                    emit-value
                    :disable="classroomRadio != 2"
                    :options="sectionOptions"
                    v-model="postsectionSelected"
                    class="bg2 q-px-md"
                    style="border:1px solid;border-radius:5px;height:40px"
                    borderless
                  ></q-select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="6">
                  <!-- เส้นแบ่ง -->
                  <div
                    class="q-mt-lg q-mb-lg"
                    style="border-top:1px dashed #353535;border-width:2px;opacity:0.5"
                  ></div>
                </td>
              </tr>
              <tr>
                <td colspan="2">ส่วนการเก็บคะแนน</td>
                <td>
                  <q-checkbox v-model="practiceChoose" val="แบบฝึกหัด" label="แบบฝึกหัด" />
                </td>
                <td colspan="2" align="center">
                  <q-checkbox v-model="practiceChoose" val="แบบทดสอบ" label="แบบทดสอบ" />
                </td>
                <td>
                  <q-checkbox v-model="practiceChoose" val="ข้อสอบ" label="ข้อสอบ" />
                </td>
              </tr>
              <tr>
                <td colspan="2">คะแนนเต็มในการเก็บ</td>
                <td colspan="2">
                  <q-input
                    class="bg2 q-px-md"
                    v-model="score"
                    borderless
                    style="border:1px solid;border-radius:5px;height:40px"
                  ></q-input>
                </td>
                <td colspan="2"></td>
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
      classroomRadio: "1",
      practiceChoose: ["แบบฝึกหัด", "แบบทดสอบ", "ข้อสอบ"],
      score: 20,
      teacherData: this.$q.localStorage.getItem("teacherData"),
      sectionOptions: [],
      presectionSelected: 1,
      postsectionSelected: 1,
      sectionSelected: 1,
      sectionOptionsTemp: [],
      studentScoreData: []
    };
  },
  methods: {
    changeRadioType() {
      this.sectionOptions = this.sectionOptionsTemp;
      this.presectionSelected = 1;
      this.postsectionSelected =
        this.sectionOptionsTemp.length > 1
          ? this.sectionOptionsTemp[1]
          : this.sectionOptionsTemp[0];
      this.sectionSelected = 1;
    },
    changePreSection() {
      let _this = this;
      this.sectionOptions = this.sectionOptionsTemp;
      let sectionClone = this.sectionOptions.slice();
      if (
        this.presectionSelected ==
        this.sectionOptionsTemp[this.sectionOptionsTemp.length - 1]
      ) {
        this.sectionOptions = sectionClone.filter(function(x) {
          return x > _this.presectionSelected;
        });
        this.postsectionSelected = this.sectionOptionsTemp[
          this.sectionOptionsTemp.length - 1
        ];
      } else {
        this.sectionOptions = sectionClone.filter(function(x) {
          return x > _this.presectionSelected;
        });
        this.postsectionSelected = this.sectionOptions[0];
      }
    },
    previousPage() {
      this.$router.push("/teacherRanking");
    },
    async printScore() {
      this.showLoading();
      let printSection;
      let academicKey = await this.getAcademicYear();
      // let studentData = [];
      // let loadStudent = await db
      //   .collection("Student")
      //   .where("schoolCode", "==", this.teacherData.school)
      //   .where("year", "==", academicKey)
      //   .where("room", "==", this.classroomSelected)
      //   .get();
      // loadStudent.forEach(stuDoc => {
      //   let dataKey = { key: stuDoc.id };
      //   let dataFinal = { ...dataKey, ...stuDoc.data() };
      //   studentData.push(dataFinal);
      // });
      // studentData.sort((a, b) => {
      //   return a.no - b.no;
      // });

      let studentData = this.$q.localStorage.getItem("studentDataLocal");

      studentData = studentData.filter(x => {
        return x.room == this.classroomSelected;
      });

      if (this.classroomRadio == "1") {
        printSection = "คาบเรียนที่ " + this.sectionSelected;
      } else {
        printSection =
          "คาบเรียนที่ " +
          this.presectionSelected +
          " ถึง คาบเรียนที่ " +
          this.postsectionSelected;
      }
      // 1 คือ เลือกแบบคาบเดียว
      // 2 คือ เลือกแบบ คาบเริ่มต้น - คาบที่กำหนด
      if (this.classroomRadio == "1") {
        // กรณี เลือกแบบคาบเดียว
        let counter = 0;
        studentData.forEach(async element => {
          let studentKey = element.key;
          let scoreLog = await db
            .collection("studentScoreLog")
            .where("studentKey", "==", studentKey)
            .where("academicKey", "==", academicKey)
            .where("section", "==", this.sectionSelected)
            .get();
          let scoreTemp = 0;
          let countPractice = 0;
          let scorePractice = 0;
          scoreLog.forEach(element => {
            if (
              this.practiceChoose.includes(element.data().practiceType) &&
              element.data().practiceType != "กระดาษคำตอบ" &&
              element.data().practiceType != "แบบฝึกหัด"
            ) {
              scoreTemp += element.data().scorePercent;
            }
            if (element.data().practiceType == "แบบฝึกหัด") {
              countPractice++;
              scorePractice += element.data().scorePercent;
            }
          });

          if (countPractice > 1) {
            scorePractice = scorePractice / countPractice;
          }
          scoreTemp = scorePractice + scoreTemp;

          let calScore = scoreTemp / this.practiceChoose.length;
          calScore = (calScore * this.score) / 100;
          calScore = Math.round(calScore);
          if (!calScore) {
            calScore = 0;
          }
          let dataStudent = {
            score: calScore,
            name: element.name + " " + element.surname,
            no: element.no
          };
          this.studentScoreData.push(dataStudent);
          counter++;
          if (counter == studentData.length) {
            db.collection("Synchronize")
              .doc(this.teacherData.key)
              .collection("ShowScore")
              .doc("score")
              .set({ show: this.studentScoreData })
              .then(() => {
                db.collection("Synchronize")
                  .doc(this.teacherData.key)
                  .update({
                    studyplanType: "showScore",
                    studyplanKey: "showScore"
                  })
                  .then(() => {
                    this.hideLoading();
                    this.$router.push({
                      name: "printScore",
                      params: {
                        data: this.studentScoreData,
                        room: this.classroomSelected,
                        section: printSection,
                        scoreType: "คะแนนเก็บ",
                        practiceChoose: this.practiceChoose,
                        fullScore: this.score
                      }
                    });
                  });
              });
          }
        });
      } else {
        // กรณีแบบเลือกหลายคาบ
        console.clear();
        let countSection = this.postsectionSelected - this.presectionSelected;
        countSection = countSection + 1;

        let counter = 0;
        studentData.forEach(async element => {
          let studentKey = element.key;
          let scoreTemp = [];
          let scoreLog = await db
            .collection("studentScoreLog")
            .where("studentKey", "==", studentKey)
            .where("academicKey", "==", academicKey)
            .get();

          let countPractice = [];
          let scorePractice = [];

          for (let i = 0; i < countSection; i++) {
            scoreTemp.push(0);
            scorePractice.push(0);
            countPractice.push(0);
          }

          scoreLog.forEach(element => {
            if (
              element.data().section >= this.presectionSelected &&
              element.data().section <= this.postsectionSelected
            ) {
              if (
                this.practiceChoose.includes(element.data().practiceType) &&
                element.data().practiceType != "กระดาษคำตอบ" &&
                element.data().practiceType != "แบบฝึกหัด"
              ) {
                scoreTemp[element.data().section - 1] +=
                  element.data().scorePercent / this.practiceChoose.length;
              } else if (element.data().practiceType == "แบบฝึกหัด") {
                countPractice[element.data().section - 1]++;

                scorePractice[
                  element.data().section - 1
                ] += element.data().scorePercent;

                scorePractice[element.data().section - 1] =
                  scorePractice[element.data().section - 1] /
                  countPractice[element.data().section - 1];

                scorePractice[element.data().section - 1] =
                  scorePractice[element.data().section - 1] /
                  this.practiceChoose.length;
              }
            }
          });

          let sum = scoreTemp.map((arr1, index) => {
            return arr1 + scorePractice[index];
          });

          let scoreSum = sum.reduce((a, b) => a + b, 0);
          let scoreAvg = scoreSum / scoreTemp.length;
          scoreAvg = (scoreAvg * this.score) / 100;
          let dataStudent = {
            score: Math.round(scoreAvg),
            name: element.name + " " + element.surname,
            no: element.no
          };
          this.studentScoreData.push(dataStudent);
          counter++;
          if (counter == studentData.length) {
            db.collection("Synchronize")
              .doc(this.teacherData.key)
              .collection("ShowScore")
              .doc("score")
              .set({ show: this.studentScoreData })
              .then(() => {
                this.hideLoading();
                this.$router.push({
                  name: "printScore",
                  params: {
                    data: this.studentScoreData,
                    room: this.classroomSelected,
                    section: printSection
                  }
                });
              });
          }
        });
      }
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
      for (let i = 0; i < sectionCount.size; i++) {
        this.sectionOptions.push(i + 1);
        this.sectionOptionsTemp.push(i + 1);
      }

      this.postsectionSelected =
        this.sectionOptionsTemp.length > 1
          ? this.sectionOptionsTemp[1]
          : this.sectionOptionsTemp[0];
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