<template>
  <div v-if="!isLoading">
    <teacher-bar
      :isShowBackBtn="true"
      @testFunc="clearIntervalFunc()"
      :backtopagename="'/teacherStudyplan'"
    ></teacher-bar>
    <div class="maindiv animated fadeIn" style="margin:auto">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">{{ sectionName}}</div>
      </div>
      <!-- CONTENT -->
      <div
        class="bg8 q-py-lg q-pa-xl"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <!-- CLOCK -->
        <div align="right">
          <div
            style="width:120px;border-radius:10px;border:2px solid #353535 "
            class="q-pa-sm text-h6 bg-white"
            align="center"
          >
            <span v-show="!showTimeoutText">
              <q-icon class="far fa-clock" />
              {{ minutes }}: {{ seconds }}
            </span>
            <span
              v-show="showTimeoutText"
              class="animated flash infinite color11"
              style="animation-duration:1.5s"
            >หมดเวลา</span>
          </div>
        </div>
        <div
          align="center"
          class="text-h6 color1"
        >{{studyName}} - {{ currentIndex +1 }} / {{ vdoData.length }}</div>

        <div style="width:100%">
          <q-video
            style="width:100%;max-height:500px;height:100vh"
            :src="vdoData[currentIndex].vdoURL"
          />
        </div>
        <!-- next and previous button and finish button -->
        <div class="q-pt-md row">
          <div align="left" :class="{'col-6' : !isShowFinishButton,'col-4' : isShowFinishButton}">
            <q-btn
              @click="nextVideo('previous')"
              icon="fas fa-chevron-left"
              push
              class="bg5 color2"
              :disable="currentIndex == 0"
            ></q-btn>
          </div>
          <div align="center" v-show="isShowFinishButton" class="col-4">
            <q-btn
              @click="finishTeaching()"
              push
              class="bg5 color2"
              label="เสร็จสิ้น"
              style="max-width:250px;min-width:100%"
            ></q-btn>
          </div>
          <div align="right" :class="{'col-6' : !isShowFinishButton,'col-4' : isShowFinishButton}">
            <q-btn
              :disable="currentIndex == vdoData.length -1"
              @click="nextVideo('next')"
              icon="fas fa-chevron-right"
              push
              class="bg5 color2"
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
      sectionName: "",
      studyName: "",
      vdoData: [],
      currentIndex: 0,
      minutes: 0,
      seconds: 0,
      showTimeoutText: false,
      isShowFinishButton: false,
      teacherData: this.$q.localStorage.getItem("teacherData"),
      isLoading: true,
      myInterval: null
    };
  },
  methods: {
    async finishTeaching() {
      this.showLoading();
      let getTime = await this.getTime();
      let academicKey = await this.getAcademicYear();
      1;
      clearInterval(this.myInterval);
      db.collection("Synchronize")
        .doc(this.teacherData.key)
        .update({
          studyplanType: "studyplan",
          studyplanKey: "studyplan",
          finishVdo: true
        })
        .then(() => {
          db.collection("StudyplanReportLog")
            .add({
              schoolKey: this.teacherData.school,
              time: getTime,
              practicekey: this.$route.params.key,
              teacherKey: this.teacherData.key,
              academicKey: academicKey,
              classroom: this.$q.localStorage.getItem("classroomSelected"),
              section: this.$q.localStorage.getItem("currentSectionNumber"),
              microtime: getTime.microtime,
              practiceType: "VDO การสอน"
            })
            .then(() => {
              db.collection("TeacherStudyplanLog")
                .where("practiceKey", "==", this.$route.params.key)
                .where("teacherKey", "==", this.teacherData.key)
                .where("academicKey", "==", academicKey)
                .get()
                .then(checkPermission => {
                  if (checkPermission.size == 0) {
                    db.collection("TeacherStudyplanLog")
                      .add({
                        status: true,
                        time: getTime,
                        practiceKey: this.$route.params.key,
                        teacherKey: this.teacherData.key,
                        academicKey: academicKey
                      })
                      .then(() => {
                        this.$router.push("/teacherStudyplan");
                        this.hideLoading();
                      });
                  } else {
                    this.$router.push("/teacherStudyplan");
                    this.hideLoading();
                  }
                });
            });
        });
    },
    nextVideo(type) {
      this.showLoading();
      db.collection("Synchronize")
        .doc(this.teacherData.key)
        .update({
          vdoIndex:
            type == "next" ? this.currentIndex + 1 : this.currentIndex - 1
        })
        .then(() => {
          if (type == "next") {
            this.currentIndex++;
          } else {
            this.currentIndex--;
          }
          if (this.currentIndex + 1 == this.vdoData.length) {
            this.isShowFinishButton = true;
          }
          this.hideLoading();
        });
    },
    async localGetSectionName() {
      this.sectionName = this.$q.localStorage.getItem("sectionName");
    },
    loadVdoData() {
      db.collection("Video")
        .where("practiceKey", "==", this.$route.params.key)
        .get()
        .then(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            let dataKey = { key: element.id };
            let dataFinal = { ...dataKey, ...element.data() };
            dataTemp.push(dataFinal);
          });
          this.vdoData = dataTemp;
          this.vdoData.sort((a, b) => {
            return a.orderId - b.orderId;
          });
          this.isLoading = false;
        });
    },
    loadStudyplan() {
      db.collection("StudyPlan")
        .doc(this.$route.params.key)
        .get()
        .then(data => {
          this.studyName = data.data().name;
        });
    },
    clearIntervalFunc() {
      clearInterval(this.myInterval);
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.loadVdoData();
    this.localGetSectionName();
    this.loadStudyplan();
    this.minutes = this.$q.localStorage.getItem("minutes");
    this.seconds = this.$q.localStorage.getItem("seconds");
    this.myInterval = setInterval(() => {
      if (this.minutes < 0) {
        // หมดเวลา
        this.showTimeoutText = true;
        clearInterval(this.myInterval);
      } else {
        if (this.seconds == 0) {
          this.seconds = 59;
          let newMinutes = (this.minutes -= 1);
          this.$q.localStorage.set("minutes", newMinutes);
          this.$q.localStorage.set("seconds", 59);
          this.minutes = this.$q.localStorage.getItem("minutes");
          this.seconds = this.$q.localStorage.getItem("seconds");
        } else {
          let newSeconds = Number((this.seconds -= 1));
          this.$q.localStorage.set("seconds", newSeconds);
          this.seconds =
            this.$q.localStorage.getItem("seconds") < 10
              ? "0" + this.$q.localStorage.getItem("seconds")
              : this.$q.localStorage.getItem("seconds");
        }
      }
    }, 1000);
    let _this = this;
    window.onpopstate = function() {
      clearInterval(_this.myInterval);
    };
  }
};
</script>

<style lang="scss" scoped>
</style>