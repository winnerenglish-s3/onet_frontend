<template>
  <div>
    <teacher-bar></teacher-bar>
    <div class="maindiv color1" style="margin:auto">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div
          class="absolute-full flex flex-center color1 text-h6"
        >{{ this.$q.localStorage.getItem("showAnswerType") }}</div>
      </div>
      <!-- CONTENT -->
      <div
        class="bg8 q-py-lg q-pa-xs-xs q-pa-lg-xl"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div class="q-pa-md" :class="{'text-h5' : this.$q.platform.is.desktop}">
          <!-- Table Header -->
          <div class="row q-pa-sm">
            <div align="center" class="col-md-1 col-xs-4">
              เลขที่
              <q-icon @click="sortNo()" class="cursor-pointer" name="fas fa-sort"></q-icon>
            </div>
            <div class="col" align="center">ชื่อ-นามสกุล</div>
            <div align="center" class="col-md-2 col-xs-4">
              คะแนน
              <q-icon class="cursor-pointer" @click="sortScore()" name="fas fa-sort"></q-icon>
            </div>
          </div>
          <!-- Table Content -->
          <div :class="{'text-h5' : this.$q.platform.is.desktop}">
            <div class="row q-pa-sm animated fadeIn" v-for="(item,index) in scoreData" :key="index">
              <div class="col-1 q-pa-sm" align="center">
                <div class="bg9 q-pa-sm" style="border-radius:5px">{{ item.studentNo }}</div>
              </div>
              <div class="col q-pa-sm">
                <div class="bg9 q-pa-sm q-pl-xl" style="border-radius:5px">{{ item.studentName }}</div>
              </div>
              <div class="col-2 q-pa-sm">
                <div class="bg9 q-pa-sm" align="center" style="border-radius:5px">{{ item.score }}</div>
              </div>
            </div>

            <div align="center" class="q-pt-lg">
              <q-btn
                @click="backtoHome()"
                style="width:250px"
                label="กลับสู่หน้าหลัก"
                class="bg5 color2"
                push
              ></q-btn>
            </div>
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
      teacherData: this.$q.localStorage.getItem("teacherData"),
      scoreData: [],
      sortNoType: false,
      sortScoreType: false,
      columns: [
        {
          name: "no",
          label: "เลขที่",
          sortable: true,
          style: "width:50px",
          align: "center",
          field: "studentNo"
        },
        {
          name: "name",
          label: "ชื่อ-นามสกุล",
          align: "center"
        },
        {
          name: "score",
          label: "คะแนน",
          style: "width:150px",
          align: "center",
          sortable: true
        }
      ]
    };
  },
  methods: {
    backtoHome() {
      this.$router.push("/teacherStudyplan");
    },
    sortNo() {
      this.sortNoType = !this.sortNoType;
      this.scoreData.sort((a, b) => {
        if (this.sortNoType) {
          return a.studentNo - b.studentNo;
        } else {
          return b.studentNo - a.studentNo;
        }
      });
    },
    sortScore() {
      this.sortScoreType = !this.sortScoreType;
      this.scoreData.sort((a, b) => {
        if (this.sortScoreType) {
          return b.score - a.score;
        } else {
          return a.score - b.score;
        }
      });
    },
    async loadScoreTable() {
      this.showLoading();
      let academicKey = await this.getAcademicYear();
      db.collection("studentScoreLog")
        .where("practiceKey", "==", this.$route.params.key)
        .where("schoolCode", "==", this.teacherData.school)
        .where("academicKey", "==", academicKey)
        .where("room", "==", this.$q.localStorage.getItem("classroomSelected"))
        .get()
        .then(doc => {
          let scoreTemp = [];
          doc.forEach(element => {
            let score = 0;
            for (let i = 0; i < element.data().dataAnswerList.length; i++) {
              if (element.data().dataAnswerList[i].status == "ถูก") {
                score++;
              }
            }
            let dataScore = {
              score: score,
              key: element.id
            };
            let dataFinal = { ...dataScore, ...element.data() };
            // Sort score รอเทสใหม่

            scoreTemp.push(dataFinal);
          });
          scoreTemp.sort((a, b) => {
            return b.score - a.score;
          });
          this.hideLoading();
          this.scoreData = scoreTemp;
        });
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.loadScoreTable();
  }
};
</script>

<style lang="scss" scoped>
</style>