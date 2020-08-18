/* jshint esversion : 6 */
import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";
// import VueGoogleCharts from 'vue-google-charts'

// Vue.use(VueGoogleCharts)

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCfBrMSIExvrqNQarXuyx4nx-eCiad2Kqo",
  authDomain: "onet-p6.firebaseapp.com",
  databaseURL: "https://onet-p6.firebaseio.com",
  projectId: "onet-p6",
  storageBucket: "onet-p6.appspot.com",
  messagingSenderId: "769708058724",
  appId: "1:769708058724:web:2de2dcf7a7053d73e91771"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
const axios = require("axios");
Vue.mixin({
  data() {
    return {
      version: "1.0.2",
      dataSnapshot: "",
      snapMain: "",
      snapExp: "",
      snapStudentLogin: "",
      timerInterval: "",
      onlineStudentSnapshot: "",
      snapCheckStatusLogout: "",
      isPlatForm: false,
      getStudyplanLogSnapshot: "",
      teacherDataIndex: this.$q.localStorage.getItem("teacherData")
    };
  },
  methods: {
    notifyRed(text) {
      this.$q.notify({
        message: text,
        color: "negative",
        icon: "fas fa-exclamation",
        position: "top"
      });
    },
    notifyGreen(text) {
      this.$q.notify({
        message: text,
        color: "accent",
        icon: "fas fa-exclamation",
        position: "top"
      });
    },
    showLoading() {
      this.$q.loading.show({
        delay: 400
      });
    },
    hideLoading() {
      this.$q.loading.hide();
    },
    async getTime() {
      let getTime = await axios.get(
        "https://api.winner-english.com/data/api/gettime.php"
      );
      return getTime.data[0];
    },
    // FOR TEACHER
    checkTeacherPermission() {
      if (this.$q.localStorage.getItem("userType") != "teacher") {
        // หาก User ที่เข้าทำการไม่ใช่คุณครู ดีดออก
        // ป้องกันเด็กเข้าผ่าน URL:
        this.$q.localStorage.clear();
        this.$router.push("/");
      }
    },
    // FOR TEACHER
    async getAcademicYear() {
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
      let data = await db
        .collection("AcademicYear")
        .where("academicYear", "==", currentYear)
        .where(
          "school",
          "==",
          this.$q.localStorage.getItem("teacherData").school
        )
        .get();
      return data.docs[0].id;
    },

    // FOR TEACHER
    async getSectionName() {
      let data = await db
        .collection("Section")
        .doc(this.$q.localStorage.getItem("sectionSelected"))
        .get();
      return data.data().orderId + "-" + data.data().name;
    },
    // FOR TEACHER
    async getTotalStudent() {
      let academicYear = await this.getAcademicYear();
      let data = await db
        .collection("Student")
        .where("room", "==", this.$q.localStorage.getItem("classroomSelected"))
        .where(
          "schoolCode",
          "==",
          this.$q.localStorage.getItem("teacherData").school
        )
        .where("year", "==", academicYear)
        .where("status", "==", "online")
        .get();

      this.$q.localStorage.set("totalStudent", data.size);

    },
    async logout() {
      this.$q
        .dialog({
          dark: true,
          title: "ออกจากระบบ",
          message: "คุณต้องการออกจากระบบใช่หรือไม่?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          if (this.$q.localStorage.getItem("userType") == "teacher") {

            db.collection("Synchronize")
              .doc(this.$q.localStorage.getItem("teacherData").key)
              .update({
                status: "logout"
              })
              .then(() => {
                this.$q.localStorage.clear();
                this.hideLoading();
                this.$router.push("/");
              });
          } else {
            db.collection("Student")
              .doc(this.student.key)
              .update({
                status: "logout"
              })
              .then(() => {
                if (this.dataSnapshot) {
                  this.dataSnapshot();
                }
                this.snapStudentLogin();
                this.snapMain();
                this.snapExp();
                this.$q.localStorage.clear();
                this.$router.push("/");
              });
          }
        });
    },
    loadVersion() {
      db.collection("version")
        .doc("frontend")
        .onSnapshot({
            includeMetadataChanges: true
          },
          data => {
            if (data.data().version != this.version) {
              window.location.reload(true);
            }
          }
        );
    },
    checkPlatForm() {
      if (this.$q.platform.is.mobile) {
        this.$q
          .dialog({
            message: "ระบบไม่รองรับการใช้งานบนโทรศัพท์มือถือในขณะนี้",
            ok: "กลับไปหน้าเว็บไซต์",
            persistent: true
          })
          .onOk(() => {
            window.location.href = "https://www.winner-english.com";
          });
      }
    },
    checkStatusLogout() {
      db
        .collection("Synchronize")
        .doc(this.teacherDataIndex.key)
        .get()
        .then(doc => {
          if (doc.data().status == "logout") {
            this.notifyRed("มีการเข้าใช้งานจากอุปกรณ์อื่น");

            this.$q.localStorage.clear();
            this.$router.push("/");
          }
        });
    }
  }
});

export default function ( /* { store, ssrContext } */ ) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  return Router;
}
