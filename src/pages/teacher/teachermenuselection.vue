<template>
  <div>
    <teacher-bar :isShowBackBtn="false"></teacher-bar>
    <div class="flex flex-center animated fadeIn" style="height:calc(100vh - 70px)">
      <div class="row fit justify-center items-center">
        <div class="col-md-6 col-xs-11">
          <div class="text-center bg-transparent relative-position" style="bottom:-15px">
            <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
            <div class="absolute-full flex flex-center">
              <span class="color1 text-h4">โรงเรียน {{ this.schoolName }}</span>
            </div>
          </div>
          <div
            class="bg9 q-py-lg"
            style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
          >
            <div align="center" class="text-h6 color1">กรุณาเลือก</div>
            <!-- เลือกชั้น / ห้อง -->
            <div class="q-px-xl q-pt-lg">
              <q-select
                v-model="classroomSelected"
                label="ชั้น/ห้อง"
                class="bg-white q-px-sm color1"
                style="border:1px solid#353535;border-radius:5px"
                borderless
                map-options
                emit-value
                :options="classroomOptions"
              ></q-select>
            </div>

            <!-- เลือกคาบเรียน -->
            <div class="q-px-xl q-pt-lg">
              <q-select
                @input="changeSection()"
                v-model="sectionSelected"
                label="คาบเรียน/เรื่อง"
                class="bg-white q-px-sm color1"
                style="border:1px solid#353535;border-radius:5px"
                borderless
                :options="sectionOptions"
              ></q-select>
            </div>
            <div class="q-pt-lg" align="center">
              <!-- <router-link :to="{name : 'teacherStudyplan',params:{classroomSelected,sectionSelected}}"> -->
              <q-btn
                label="เรียน"
                class="bg5 text-white"
                style="width:250px"
                push
                @click="gotoStudyplan()"
              ></q-btn>
              <!-- </router-link> -->
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
const axios = require("axios");
export default {
  components: {
    teacherBar
  },
  data() {
    return {
      classroomOptions: this.$q.localStorage.has("classroomOptions")
        ? this.$q.localStorage.getItem("classroomOptions")
        : [],
      sectionOptions: this.$q.localStorage.has("sectionOptions")
        ? this.$q.localStorage.getItem("sectionOptions")
        : [],
      classroomSelected: this.$q.localStorage.has("classroomSelected")
        ? this.$q.localStorage.getItem("classroomSelected")
        : "",
      sectionSelected: this.$q.localStorage.has("sectionSelected")
        ? this.$q.localStorage.getItem("sectionSelected")
        : "",
      schoolName: "",
      teacherData: this.$q.localStorage.getItem("teacherData"),
      classroomSelectedArr: []
    };
  },
  methods: {
    changeSection() {
      this.$q.localStorage.set("sectionName", this.sectionSelected.label);
      this.$q.localStorage.set(
        "currentSectionNumber",
        this.sectionSelected.label.substr(0, 1)
      );
    },
    async getOnlineStudent() {
      let academicKey = await this.getAcademicYear();
      let microtime = await this.getTime();
      microtime = microtime.microtime;
      db.collection("Student")
        .where("room", "==", this.$q.localStorage.getItem("classroomSelected"))
        .where("schoolCode", "==", this.teacherData.school)
        .where("status", "==", "online")
        .where("year", "==", academicKey)
        .onSnapshot(doc => {
          let totalOnlineStudent = doc.size;
        });
    },
    async gotoStudyplan() {
      this.showLoading();
      let dataTeacher = [];

      let academicKey = await this.getAcademicYear();
      let checkSync = await db
        .collection("Synchronize")
        .where("schoolcode", "==", this.teacherData.school)
        .where("currentTeachRoom", "==", this.classroomSelected)
        .where("academicKey", "==", academicKey)
        .get();
      // ดีดคนอื่นที่เลือกสอนระดับชั้นเดียวกันออก
      for (const item of checkSync.docs) {
        let teacherKey = item.id;
        if (teacherKey != this.teacherData.key) {
          db.collection("Synchronize")
            .doc(teacherKey)
            .update({ status: "logout" });
        }
      }

      this.$q.localStorage.set("classroomSelected", this.classroomSelected);
      this.$q.localStorage.set("sectionSelected", this.sectionSelected);
      this.$q.localStorage.remove("studyplanData");
      let dateTime = await this.getTime();
      let sectionName = this.$q.localStorage.getItem("sectionName");
      db.collection("Synchronize")
        .doc(this.$q.localStorage.getItem("teacherData").key)
        .update({
          currentTeachRoom: this.classroomSelected,
          activetime: dateTime,
          section: sectionName,
          academicKey: academicKey
        })
        .then(async () => {
          let studentCollection = await db
            .collection("Student")
            .where(
              "schoolCode",
              "==",
              this.$q.localStorage.getItem("teacherData").school
            )
            .where("year", "==", academicKey)
            .get();
          let studentData = [];
          studentCollection.forEach(stuDoc => {
            let dataKey = { key: stuDoc.id };
            let dataFinal = { ...dataKey, ...stuDoc.data() };
            studentData.push(dataFinal);
          });
          studentData.sort((a, b) => {
            return a.no - b.no;
          });
          this.$q.localStorage.set("studentDataLocal", studentData);

          this.hideLoading();
          this.$router.push("/teacherStudyplan");
        });

      if (
        this.$q.localStorage.getItem("isSelectedClassRoom") != true ||
        this.$q.localStorage.getItem("isSelectedClassRoom") == null
      ) {
        db.collection("Student")
          .where(
            "room",
            "==",
            this.$q.localStorage.getItem("classroomSelected")
          )
          .where("schoolCode", "==", this.teacherData.school)
          .where("year", "==", academicKey)
          .get()
          .then(stu => {
            for (const element of stu.docs) {
              db.collection("Student")
                .doc(element.id)
                .update({
                  status: "logout"
                });
            }
            this.$q.localStorage.set("isSelectedClassRoom", true);
          });
      }
    },
    async getMainData() {
      this.showLoading();
      let school = await db
        .collection("School")
        .doc(this.teacherData.school)
        .get();
      this.schoolName = school.data().schoolName;
      this.$q.localStorage.set("schoolName", this.schoolName);
      this.getSection();
    },
    async getSection() {
      let section = await db
        .collection("Section")
        .orderBy("orderId")
        .get();
      let sectionTemp = [];
      let sectionCounter = 1;
      section.forEach(element => {
        let dataKey = {
          key: element.id,
          label: sectionCounter + "-" + element.data().name,
          value: element.id
        };
        let dataFinal = { ...dataKey, ...element.data() };
        sectionTemp.push(dataFinal);
        sectionCounter++;
      });
      this.sectionSelected = sectionTemp[0];
      this.sectionOptions = sectionTemp;
      this.$q.localStorage.set("sectionOptions", this.sectionOptions);
      this.$q.localStorage.set("sectionSelected", this.sectionSelected);
      this.$q.localStorage.set("sectionName", this.sectionOptions[0].label);
      this.$q.localStorage.set("currentSectionNumber", 1);
      this.getClassroom();
    },
    async getClassroom() {
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
            this.$q.localStorage.set("classroomOptions", this.classroomOptions);
            this.$q.localStorage.set(
              "classroomSelected",
              this.classroomSelected
            );
          }
          this.hideLoading();
        });
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.loadVersion();
    if (
      !(
        this.$q.localStorage.has("classroomOptions") &&
        this.$q.localStorage.has("sectionOptions") &&
        this.$q.localStorage.has("schoolName")
      )
    ) {
      this.getMainData();
    }
  }
};
</script>

<style lang="scss" scoped></style>
