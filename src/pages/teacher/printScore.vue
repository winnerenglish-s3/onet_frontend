<template>
  <div align="center">
    <teacher-bar
      :isShowBackBtn="true"
      class="no-print q-mb-sm"
      :backtopagename="this.$route.params.scoreType == 'คะแนนการบ้าน' ? '/teacherHomeworkScore' : this.$route.params.scoreType == 'คะแนนทบทวน' ? '/teacherReviewScore' : '/teacherScore'"
    ></teacher-bar>
    <div class="float-right q-px-md no-print">
      <q-btn icon="fas fa-print" class="bg5 color2" @click="printPage()" size="20px" round></q-btn>
    </div>
    <div class="bg-white a4Page">
      <div align="center" class="q-pb-sm text-h6 text-weight-bold">
        <span v-if="$route.params.scoreType == 'คะแนนทบทวน'">ตารางความก้าวหน้าทบทวน O-NET</span>
        <span v-else>ตารางคะแนนเก็บนักเรียน</span>
        {{ this.$route.params.section }}
      </div>
      <div
        align="center"
        class="q-pa-sm text-h6 text-weight-bold"
      >โรงเรียน{{ this.$q.localStorage.getItem("schoolName") }} {{ this.$route.params.room.replace("ป.","ชั้นประถมศึกษาปีที่ ") }}</div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <td style="width:100px" align="center" class="q-pa-sm">เลขที่</td>
            <td align="center">ชื่อ-นามสกุล</td>
            <td style="width:120px" align="center">
              <span v-if="$route.params.scoreType != 'คะแนนทบทวน'">คะแนน*</span>
              <span v-else>ความก้าวหน้า</span>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in this.$route.params.data" :key="index">
            <td class="q-pa-sm" align="center">{{ item.no }}</td>
            <td class="q-pl-lg">{{ item.name }}</td>
            <td
              :class="{'q-pl-xl' : $route.params.scoreType == 'คะแนนทบทวน'}"
              :style="$route.params.scoreType != 'คะแนนทบทวน' ? 'text-align:center' : 'text-align:left'"
            >
              <span v-if="$route.params.scoreType == 'คะแนนทบทวน'">
                <span v-for="i in item.score" :key="i">
                  <span class="fas fa-star color7"></span>
                </span>
              </span>
              <span v-else>{{ item.score }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="q-pl-sm q-pt-sm" align="left" v-if="$route.params.scoreType != 'คะแนนทบทวน'">
        *{{ this.$route.params.scoreType }}คำนวณมาจาก
        <!-- REMARK ของ คะแนนเก็บ -->
        <span v-if="this.$route.params.scoreType=='คะแนนเก็บ'">
          <span
            v-for="(practice,index) in this.$route.params.practiceChoose"
            :key="index"
          >{{practice + ","}}</span>
        </span>
        <!-- REMARK ของคะแนนการบ้าน -->
        <span v-else>คะแนนการบ้านของนักเรียน</span>
        โดยมีคะแนนเต็ม {{ this.$route.params.fullScore }} คะแนน
      </div>
    </div>
  </div>
</template>

<script>
import teacherBar from "../../components/teacherappbar.vue";
export default {
  components: {
    teacherBar
  },
  methods: {
    printPage() {
      window.print();
    }
  },
  mounted() {}
};
</script>

<style scoped>
table tr td {
  border: 1px solid;
}
.a4Page {
  size: A4;
  margin: 0;
  width: 210mm;
  height: fit-content;
  min-height: 100vh;
}
@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
  }
  .no-print,
  .no-print * {
    display: none !important;
  }
  /* ... the rest of the rules ... */
}
</style>