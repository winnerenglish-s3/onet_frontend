<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-px-sm q-pb-sm">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h5">{{section}}</span>
        </div>
      </div>
      <div class="bg8 q-pt-lg borders1-sm borders-rb q-mx-sm" align="center">
        <div class="row justify-center items-center me-scrollbar" v-if="!isLoadData">
          <q-spinner-dots class="color10" size="100px" />
        </div>
        <div class="me-scrollbar" v-if="isLoadData">
          <div align="center" class="q-pt-md text-h6">
            <span>วีดีโอการสอน &nbsp;</span>
            <span>{{vdoIndex + 1 + "/" + dataSlides.length}}</span>
          </div>
          <div class="q-pa-md">
            <q-img
              :src="dataSlides[vdoIndex].imageURL"
              v-if="dataSlides.length > 0"
              style="width:100%;"
            ></q-img>
          </div>
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
      vdoIndex: 0, // มีหน้าที่ในการเปลื่ยนแปลงรูปถาพ ผ่านการ Snapshot
      section: "", // เก็บข้อมูลคาบเรียน
      student: this.$q.localStorage.getItem("studentData"), // เก็บข้อมูลนักเรียน

      dataSlides: [], // เก็บข้อมูลรูปถาพ

      isSaveData: false, // เช็คข้อมูลการบันทึก
      isFinish: false, // โชว์ปุ่มส่งคำตอบถ้าทำแบบฝึกหัดเสร็จทั้งหมด
      isLoadData: false
    };
  },
  methods: {
    // โหลดข้อมูลวีดีโอการสอน
    loadPractice() {
      let practiceKey = this.$q.localStorage.getItem("practiceKey");
      db.collection("Video")
        .where("practiceKey", "==", practiceKey)
        .get()
        .then(doc => {
          if (doc.size > 0) {
            let dataImage = [];
            doc.forEach(data => {
              dataImage.push(data.data());
            });

            dataImage.sort((a, b) => {
              return a.orderId - b.orderId;
            });

            this.dataSlides = dataImage;
          }

          this.isLoadData = true;
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
            this.vdoIndex = doc.docs[0].data().vdoIndex;
            if (doc.docs[0].data().finishVdo) {
              this.dataSnapshot(); // เคลียร์ Snapshot
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
      this.load();
    }
  }
};
</script>

<style scoped>
.me-scrollbar {
  height: fit-content;
  min-height: calc(100vh - 280px);
}
</style>