<template>
  <div class="bg5 q-pa-md color2 row items-center justify-end print-hide">
    <div>
      <q-btn
        push
        icon="fas fa-arrow-left"
        class="bg10 q-mr-sm"
        @click="backtopage()"
        v-show="this.$attrs.isShowBackBtn"
      />
      <span class="text-h6">Winner O-NET</span>
    </div>
    <q-space />
    <!-- ปุ่มแสดงชื่อผู้ใช้งาน -->
    <div v-show="this.$route.name != 'teacherEditInfo'" class="q-pt-sm-xs">
      <q-btn
        :disable="this.$route.name != 'teacherStudyplan' && this.$route.name != 'teacherMenuSelection'"
        push
        icon="fas fa-user"
        style="background-color:#3B6EA1"
        :label="this.$q.localStorage.getItem('teacherData').name + ' ' + this.$q.localStorage.getItem('teacherData').surname"
        @click="editTeacherInfo()"
      ></q-btn>
    </div>
    <!-- ปุ่มแสดงผลคะแนน -->
    <div class="q-pl-md q-pt-sm-xs q-pt-xs-md">
      <q-btn
        :disable="this.$route.name != 'teacherStudyplan'"
        @click="ranking()"
        push
        icon="fas fa-chart-line"
        class="bg4"
      ></q-btn>
    </div>

    <div class="q-pl-md q-pt-sm-xs q-pt-xs-md">
      <q-btn @click="logout()" push icon="fas fa-sign-out-alt" class="bg11"></q-btn>
    </div>
  </div>
</template>

<script>
import { db } from "../router";
props: ["backtopagename", "isShowBackBtn"];
export default {
  data() {
    return {
      teacherData: this.$q.localStorage.getItem("teacherData")
    };
  },
  methods: {
    backtopage() {
      this.$emit("testFunc");
      this.$router.push(this.$attrs.backtopagename);
    },
    editTeacherInfo() {
      this.$q.localStorage.set("previousPage", this.$route.path);

      this.$router.push("/teacherEditInfo");
    },
    ranking() {
      this.$q.localStorage.set("previousPage", this.$route.path);
      this.$router.push("/teacherRanking");
    }
  },
  mounted() {
    this.checkStatusLogout();
  }
};
</script>

<style lang="scss" scoped>
</style>