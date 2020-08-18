<template>
  <div>
    <teacher-bar :isShowBackBtn="true" :backtopagename="'/teacherRanking'"></teacher-bar>
    <div class="maindiv animated fadeIn" style="margin:auto" v-show="!isLoading">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">
          สรุปคะแนนนักเรียน Top 3
          <div class="q-px-md">
            <q-select
              class="bg-white q-px-sm"
              style="height:35px;border:1px solid #353535;border-radius:5px"
              borderless
              v-model="roomSelected"
              :options="this.$q.localStorage.getItem('classroomOptions')"
              @input="getStudentScore()"
              map-options
              emit-value
            ></q-select>
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        class="bg8 q-py-lg animated fadeIn"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div class="q-pt-lg q-pa-md">
          <!-- TOP 1 - 3 -->
          <div v-for="(item,index) in studentScore" :key="index">
            <div v-show="item.studentName.length > 0">
              <div>
                <div
                  style="border-radius:20px;position:relative;z-index:1"
                  class="q-pa-sm text-h5"
                  :class="{'scoreBg-1' : index ==0,'scoreBg-2' : index == 1,'scoreBg-3' : index == 2}"
                  align="center"
                >{{ item.score }} คะแนน</div>
              </div>
              <div class="q-px-sm">
                <div
                  class="bg9 q-pt-md row items-center justify-center"
                  style="position:relative;top:-10px"
                >
                  <div class="col-4" align="center">
                    <div class="q-pa-lg">
                      <q-img style="width:150px" :src="img[index]"></q-img>
                    </div>
                  </div>
                  <div class="col row q-py-md color1">
                    <div
                      class="col-10 q-py-sm text-h4"
                      v-for="(itemsName,nameIndex) in item.studentName"
                      :key="nameIndex"
                      :class="{'border-top' : nameIndex != 0}"
                    >{{ itemsName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div align="center">
            <q-btn
              push
              label="กลับสู่หน้าหลัก"
              style="width:300px"
              class="bg5 color2"
              to="/teacherStudyplan"
            ></q-btn>
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
      img: [
        "../../statics/1st.png",
        "../../statics/2nd.png",
        "../../statics/3rd.png"
      ],
      teacherData: this.$q.localStorage.getItem("teacherData"),
      studentScore: [
        {
          studentName: [],
          score: 0
        },
        {
          studentName: [],
          score: 0
        },
        {
          studentName: [],
          score: 0
        }
      ],
      roomSelected: this.$q.localStorage.getItem("classroomSelected"),
      roomOptions: [],
      studentData: [],
      isLoading: true
    };
  },
  methods: {
    async getStudentScore() {
      this.isLoading = true;
      this.studentScore = [
        {
          studentName: [],
          score: 0
        },
        {
          studentName: [],
          score: 0
        },
        {
          studentName: [],
          score: 0
        }
      ];
      this.showLoading();
      let academicKey = await this.getAcademicYear();
      let studentData = this.$q.localStorage.getItem("studentDataLocal");
      let studentDataTemp = [];
      let counter = 0;
      studentData.forEach(async element => {
        let studentKey = element.key;
        let scoreLog = await db
          .collection("studentScoreLog")
          .where("studentKey", "==", studentKey)
          .where("academicKey", "==", academicKey)
          .get();
        let scoreTemp = 0;
        scoreLog.forEach(element => {
          scoreTemp += element.data().scoreRaw;
        });
        let dataStudent = {
          score: scoreTemp,
          name: element.name + " " + element.surname,
          no: element.no
        };
        studentDataTemp.push(dataStudent);
        counter++;
        if (counter == studentData.length) {
          // **new Set จะสร้าง array ที่มี value ไม่ซ้ำกันออกมา
          let scoreUnique = [
            ...new Set(studentDataTemp.map(item => item.score))
          ];
          scoreUnique.sort((a, b) => {
            return b - a;
          });
          // GET TOP 3 SCORE
          scoreUnique = scoreUnique.slice(0, 3);

          for (let i = 0; i < scoreUnique.length; i++) {
            this.studentScore[i].score = scoreUnique[i];
            let studentNameFilter = studentDataTemp.filter(function(x) {
              return x.score == scoreUnique[i];
            });
            for (let x = 0; x < studentNameFilter.length; x++) {
              this.studentScore[i].studentName.push(studentNameFilter[x].name);
            }
          }

          db.collection("Synchronize")
            .doc(this.teacherData.key)
            .update({
              studyplanType: "rankingtop3",
              studyplanKey: "rankingtop3"
            })
            .then(() => {
              db.collection("Synchronize")
                .doc(this.teacherData.key)
                .collection("top3")
                .doc("score")
                .set({ show: this.studentScore })
                .then(() => {
                  this.hideLoading();
                  this.isLoading = false;
                });
            });
        }
      });
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.getStudentScore();
  }
};
</script>

<style>
.duration-flash {
  animation-duration: 2s;
}

.scoreBg-1 {
  background-color: #f1ca60;
}
.scoreBg-2 {
  background-color: #ccc7c7;
}
.scoreBg-3 {
  background-color: #e2b882;
}
.border-top {
  border-top: 1px dashed rgba(53, 53, 53, 0.3);
  border-width: 2px;
}
</style>