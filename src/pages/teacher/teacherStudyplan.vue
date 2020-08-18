<template>
  <div v-show="!isDisable">
    <teacher-bar :isShowBackBtn="false" :backtopagename="'/teacherMenuSelection'"></teacher-bar>
    <div class="maindiv animated fadeIn" style="margin:auto">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">
          {{ this.$q.localStorage.getItem("classroomSelected")}}
          | {{ sectionName }}
          <div class="absolute-right flex flex-center">
            <q-icon
              name="fas fa-edit"
              size="30px"
              style="position:relative;top:-8px;padding-right:30px"
              class="cursor-pointer"
              @click="backToSelection()"
            ></q-icon>
          </div>
        </div>
      </div>
      <!-- CONTENT -->
      <div
        class="bg8 q-py-lg q-pa-md"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div class="row q-col-gutter-md color1">
          <div class="col-12" v-for="(item,index) in studyplanData" :key="index">
            <div class="row">
              <div class="col-12">
                <q-btn
                  :disable="isDisable "
                  class="fit bg9 q-pa-md hoverBtn pink-shadow"
                  push
                  @click="goInside(index)"
                >
                  <div class="q-pl-xl">
                    <q-icon
                      name="far fa-circle"
                      class="color1"
                      v-if="!studyplanLog.includes(item.key)"
                    />
                    <q-icon name="far fa-check-circle" class="color5" v-else />
                    <span class="q-pl-lg text-h6">{{ item.name }}</span>
                  </div>
                  <q-space />
                  <div class="q-pr-xl text-h6">
                    <span
                      v-if="item.type == 'กระดาษคำตอบ' || item.type =='ข้อสอบ'"
                    >{{ item.examTime }}</span>
                    <span
                      v-else-if="item.type == 'VDO' || item.type =='แบบฝึกหัด' || item.type =='แบบทดสอบ'"
                    >{{ item.time }}</span>
                    นาที
                  </div>
                </q-btn>
              </div>
              <!-- เฉลยข้อสอบ && เฉลยการบ้าน -->
              <div
                class="col-12 q-pt-md row text-h6"
                v-if="item.type == 'ข้อสอบ' || item.type =='กระดาษคำตอบ'"
              >
                <div class="col q-pr-sm" align="right">
                  <img src="../../statics/dotted.png" alt style="width:60px" />
                </div>

                <q-btn
                  class="col-11 q-pa-md row items-center"
                  :class="{'bg9 pink-shadow hoverBtn' : studyplanLog.includes(item.key),'disabled-btn' : !studyplanLog.includes(item.key)}"
                  :disable="!studyplanLog.includes(item.key)"
                  push
                  @click="showAnswer(index)"
                  no-caps
                >
                  <q-icon
                    name="far fa-circle"
                    class="color1"
                    v-if="!studyplanLog.includes(item.key + '-answer')"
                  />
                  <q-icon name="far fa-check-circle" class="color5" v-else />

                  <span class="q-pl-md text-h6">
                    <span v-if="item.type == 'ข้อสอบ'">เฉลยข้อสอบ</span>
                    <span v-else>เฉลยการบ้าน</span>
                  </span>
                  <q-space />
                  <span
                    v-if="item.type == 'กระดาษคำตอบ' || item.type =='ข้อสอบ' "
                    class="q-pr-xl text-h6"
                  >{{ item.answerTime }} นาที</span>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <h1 class='text-white'>
        TotalStudent = {{ totalStudent }}
      </h1>-->
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

  // studyplanLog: this.$q.localStorage.has("studyplanLogData")
  //   ? this.$q.localStorage.getItem("studyplanLogData")
  //   : [],

  data() {
    return {
      studyplanData: this.$q.localStorage.has("studyplanData")
        ? this.$q.localStorage.getItem("studyplanData")
        : null,
      sectionName: "",
      studyplanLog: [],
      isDisable: false,
      teacherData: this.$q.localStorage.getItem("teacherData"),
      snapGetStudyplanLog: ""
    };
  },
  methods: {
    backToSelection() {
      this.$router.push("/teacherMenuSelection");
    },
    async showAnswer(index) {
      this.showLoading();
      this.snapGetStudyplanLog();
      let microTime = await this.getTime();
      if (this.studyplanData[index].type == "กระดาษคำตอบ") {
        db.collection("Synchronize")
          .doc(this.$q.localStorage.getItem("teacherData").key)
          .update({
            activetime: microTime,
            studyplanKey: this.studyplanData[index].key,
            studyplanType: "เฉลยการบ้าน",
            section: this.sectionName,
            answerArr: [0]
          })
          .then(() => {
            this.setLocalStorageTime(this.studyplanData[index], 2);
            this.hideLoading();
            this.$q.localStorage.set("showAnswerType", "เฉลยการบ้าน");
            this.$router.push(
              "/teacherShowAnswer/" + this.studyplanData[index].key
            );
          });
      } else {
        db.collection("Synchronize")
          .doc(this.$q.localStorage.getItem("teacherData").key)
          .update({
            activetime: microTime,
            studyplanKey: this.studyplanData[index].key,
            studyplanType: "เฉลยข้อสอบ",
            section: this.sectionName
          })
          .then(() => {
            this.setLocalStorageTime(this.studyplanData[index], 2);
            this.$q.localStorage.set("showAnswerType", "เฉลยข้อสอบ");
            this.hideLoading();
            this.$router.push(
              "/teacherTestAnswer/" + this.studyplanData[index].key
            );
          });
      }
    },
    setLocalStorageTime(obj, type) {
      // TYPE 1 = ธรรมดา 2 = เฉลยการบ้าน / เฉลยข้อสอบ
      let time;
      if (obj.type == "กระดาษคำตอบ" || obj.type == "ข้อสอบ") {
        if (type == 1) {
          time = obj.examTime;
        } else {
          time = obj.answerTime;
        }
      } else {
        time = obj.time;
      }

      let currentKey = obj.key;
      let timer = time.split(":");

      this.$q.localStorage.set("minutes", Number(timer[0]));
      this.$q.localStorage.set("seconds", Number(timer[1]));
      this.$q.localStorage.set("countdownTime", time);
    },
    loadStudyplan() {
      this.showLoading();
      db.collection("StudyPlan")
        .where(
          "section",
          "==",
          this.$q.localStorage.getItem("sectionSelected").value
        )
        .get()
        .then(doc => {
          let sectionTemp = [];
          doc.forEach(element => {
            let dataKey = { key: element.id };
            let dataFinal = { ...dataKey, ...element.data() };
            sectionTemp.push(dataFinal);
          });
          sectionTemp.sort((a, b) => {
            return a.orderId - b.orderId;
          });
          this.$q.localStorage.set("studyplanData", sectionTemp);
          this.studyplanData = sectionTemp;
          this.hideLoading();
        });
    },
    loadSection() {
      this.sectionName = this.$q.localStorage.getItem("sectionName");
    },
    async goInside(index) {
      let academicKey = await this.getAcademicYear();
      if (this.studyplanLog.includes(this.studyplanData[index].key)) {
        this.$q
          .dialog({
            title: "แจ้งเตือน",
            message: "คุณต้องการรีเซ็ทใช่ไหม?",
            cancel: true,
            persistent: true,
            dark: true
          })
          .onOk(async () => {
            this.showLoading();
            if (
              this.studyplanData[index].type == "กระดาษคำตอบ" ||
              this.studyplanData[index].type == "ข้อสอบ"
            ) {
              // ลบมาร์คเฉลยด้วย หากเป็นกระดาษคำตอบ
              db.collection("TeacherStudyplanLog")
                .where(
                  "practiceKey",
                  "==",
                  this.studyplanData[index].key + "-answer"
                )
                .where(
                  "teacherKey",
                  "==",
                  this.$q.localStorage.getItem("teacherData").key
                )
                .where("academicKey", "==", academicKey)
                .get()
                .then(doc => {
                  if (doc.size) {
                    db.collection("TeacherStudyplanLog")
                      .doc(doc.docs[0].id)
                      .delete();
                  }
                });
            }
            db.collection("TeacherStudyplanLog")
              .where("practiceKey", "==", this.studyplanData[index].key)
              .where(
                "teacherKey",
                "==",
                this.$q.localStorage.getItem("teacherData").key
              )
              .where("academicKey", "==", academicKey)
              .get()
              .then(doc => {
                db.collection("TeacherStudyplanLog")
                  .doc(doc.docs[0].id)
                  .delete()
                  .then(() => {
                    db.collection("studentScoreLog")
                      .where("academicKey", "==", academicKey)
                      .where(
                        "schoolCode",
                        "==",
                        this.$q.localStorage.getItem("teacherData").school
                      )
                      .where("practiceKey", "==", this.studyplanData[index].key)
                      .where(
                        "room",
                        "==",
                        this.$q.localStorage.getItem("classroomSelected")
                      )
                      .get()
                      .then(doc => {
                        doc.forEach(element => {
                          db.collection("studentScoreLog")
                            .doc(element.id)
                            .delete();
                        });
                        this.hideLoading();
                      });
                  });
              });
          });
      } else {
        // กรณีทั่วไปยังไม่เคยทำ
        this.snapGetStudyplanLog();
        let microTime = await this.getTime();
        this.showLoading();
        // กรณีเป็น Type ที่ไปหน้า จับเวลาถอยหลัง
        db.collection("Synchronize")
          .doc(this.$q.localStorage.getItem("teacherData").key)
          .update({
            activetime: microTime,
            studyplanKey: this.studyplanData[index].key,
            studyplanType: this.studyplanData[index].type,
            practiceType: "คำสั่ง",
            currentQuestion: 0,
            kahootFinishedPractice: [],
            answerArr: [0],
            vdoIndex: 0,
            finishVdo: false
          })
          .then(() => {
            this.setLocalStorageTime(this.studyplanData[index], 1);
            db.collection("studentScoreLog")
              .where("practiceKey", "==", this.studyplanData[index].key)
              .where("schoolCode", "==", this.teacherData.school)
              .where(
                "room",
                "==",
                this.$q.localStorage.getItem("classroomSelected")
              )
              .where("academicKey", "==", academicKey)
              .get()
              .then(async checkScoreLog => {
                if (checkScoreLog.size == 0) {
                  this.hideLoading();
                  if (this.studyplanData[index].type == "กระดาษคำตอบ") {
                    this.$router.push(
                      "/teacherCountdown/" + this.studyplanData[index].key
                    );
                    this.$q.localStorage.set("practiceType", "กระดาษคำตอบ");
                  } else if (this.studyplanData[index].type == "VDO") {
                    this.$router.push(
                      "/vdoteaching/" + this.studyplanData[index].key
                    );
                  } else if (this.studyplanData[index].type == "แบบฝึกหัด") {
                    this.$router.push(
                      "/teacherPractice/" + this.studyplanData[index].key
                    );
                  } else if (this.studyplanData[index].type == "แบบทดสอบ") {
                    this.$router.push(
                      "/preparing/" + this.studyplanData[index].key + "/1"
                    );
                  } else if (this.studyplanData[index].type == "ข้อสอบ") {
                    this.$router.push(
                      "/preparing/" + this.studyplanData[index].key + "/2"
                    );
                    this.$q.localStorage.set("practiceType", "ข้อสอบ");
                  }
                } else {
                  // เคลียข้อมูลหากมีอยู่แล้ว

                  for (const item of checkScoreLog.docs) {
                    db.collection("studentScoreLog")
                      .doc(item.id)
                      .delete();
                  }
                  this.hideLoading();

                  if (this.studyplanData[index].type == "กระดาษคำตอบ") {
                    this.$router.push(
                      "/teacherCountdown/" + this.studyplanData[index].key
                    );
                    this.$q.localStorage.set("practiceType", "กระดาษคำตอบ");
                  } else if (this.studyplanData[index].type == "VDO") {
                    this.$router.push(
                      "/vdoteaching/" + this.studyplanData[index].key
                    );
                  } else if (this.studyplanData[index].type == "แบบฝึกหัด") {
                    this.$router.push(
                      "/teacherPractice/" + this.studyplanData[index].key
                    );
                  } else if (this.studyplanData[index].type == "แบบทดสอบ") {
                    this.$router.push(
                      "/preparing/" + this.studyplanData[index].key + "/1"
                    );
                  } else if (this.studyplanData[index].type == "ข้อสอบ") {
                    this.$router.push(
                      "/preparing/" + this.studyplanData[index].key + "/2"
                    );
                    this.$q.localStorage.set("practiceType", "ข้อสอบ");
                  }
                }
              });
          });
      }
    },
    async saveStudyplan() {
      let microTime = await this.getTime();
      db.collection("Synchronize")
        .doc(this.$q.localStorage.getItem("teacherData").key)
        .update({
          activetime: microTime,
          studyplanKey: "studyplan",
          studyplanType: "studyplan"
        });
    },
    getStudyplanLog() {
      this.isDisable = true;
      let _this = this;
      this.snapGetStudyplanLog = db
        .collection("TeacherStudyplanLog")
        .where(
          "teacherKey",
          "==",
          this.$q.localStorage.getItem("teacherData").key
        )
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          this.studyplanLog = [];
          let temp = [];
          doc.forEach(element => {
            let data = {
              key: element.id
            };
            let dataFinal = { ...data, ...element.data() };
            temp.push(dataFinal);
          });
          let tempArr = temp.map(a => {
            return a.practiceKey;
          });
          _this.studyplanLog = tempArr;
          // this.$q.localStorage.set("studyplanLogData", tempArr);
          this.isDisable = false;
        });
    }
  },
  mounted() {
    this.checkTeacherPermission();
    this.saveStudyplan();
    this.loadSection();
    this.getStudyplanLog();

    if (!this.$q.localStorage.has("studyplanData")) {
      this.loadStudyplan();
    }
  }
};
</script>

<style>
.hoverBtn:hover {
  background-color: #67c7c6;
  color: white;
}
.disabled-btn {
  border: 1px dashed #817f7d;
  border-width: 1.5px;
}
.pink-shadow {
  box-shadow: 1px 3px #f59085;
}
</style>