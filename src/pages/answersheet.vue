<template>
  <div>
    <div class="q-pa-md text-h5 bg-secondary titlediv text-white">Winner O-net | อธิวราห์ คงมาลัย</div>
    <div class="maindiv borders-rtl">
      <main-title :dataTitle="'test'"></main-title>
      <div class="maincontent borders-rb">
        <div class="row header-fix-scrollbar q-py-md">
          <div class="col-1"></div>
          <div class="col-2 text-h6" align="center">ข้อ</div>
          <div class="col-2 text-h6" align="center">A</div>
          <div class="col-2 text-h6" align="center">B</div>
          <div class="col-2 text-h6" align="center">C</div>
          <div class="col-2 text-h6" align="center">D</div>
          <div class="col-1"></div>
        </div>
        <div>
          <div class="row q-mt-md questionodd" v-for="(index) in 8" :key="index">
            <div class="col-1"></div>
            <div class="col-2 text-h6" align="center">
              <div class="q-mt-md">{{index }}</div>
            </div>
            <div class="col-2 text-h6" align="center">
              <q-btn round outline class="bg-white q-my-md"></q-btn>
            </div>
            <div class="col-2 text-h6" align="center">
              <q-btn round outline class="bg-white q-my-md"></q-btn>
            </div>
            <div class="col-2 text-h6" align="center">
              <q-btn round outline class="bg-white q-my-md"></q-btn>
            </div>
            <div class="col-2 text-h6" align="center">
              <q-btn round outline class="bg-white q-my-md"></q-btn>
            </div>
            <div class="col-1"></div>
          </div>
        </div>
        <!-- <div align="center" class="q-py-md footer-fix-scrollbar">
          <q-btn class="btn text-h6" color="secondary" glossy label="ส่งคำตอบ" />
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import mainTitle from "../components/maintitle.vue";
export default {
  data() {
    return {};
  },
  components: {
    mainTitle
  }
};
</script>

<style scoped>
.mainbtn {
  width: 250px;
}
.questionodd {
  background-color: #fce0c7;
}
.answerSheetArea {
  height: calc(100vh - 360px);
  overflow-y: auto;
}
</style>