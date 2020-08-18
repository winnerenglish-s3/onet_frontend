<template>
  <div>
    <teacher-bar :isShowBackBtn="true" :backtopagename="'/teacherStudyplan'"></teacher-bar>
    <div class="maindiv" style="margin:auto">
      <!-- IMAGE HEADER -->
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:80px" />
        <div class="absolute-full flex flex-center color1 text-h6">ผลสรุปคะแนนนักเรียน</div>
      </div>
      <!-- Content -->
      <div
        class="bg8 q-py-lg"
        style="border:2px solid#353535;margin-left:4px;margin-right:4px;border-bottom-left-radius:10px;border-bottom-right-radius:10px"
      >
        <div class="row justify-around">
          <div class="col-md-9 col-xs-12">
            <div class="row">
              <div class="col-12" align="center">
                <span class="text-h5">O-NET ป.6</span>
              </div>
              <div class="col-4 q-pa-md" align="center">
                <q-btn @click="gotoTop3()" class="bg5 rounded-borders row fit" push no-caps>
                  <div class="q-pa-md col-12">
                    <img src="../../statics/trophy.png" style="width:100%" alt />
                  </div>
                  <div class="text-h6 color2">Top 3</div>
                </q-btn>
              </div>
              <div class="col-4 q-pa-md" align="center">
                <q-btn class="bg5 rounded-borders fit row" push no-caps @click="gotoScore()">
                  <div class="q-pa-md col-12">
                    <img src="../../statics/graph.png" style="width:100%" alt />
                  </div>
                  <div class="text-h6 color2">คะแนนเก็บ</div>
                </q-btn>
              </div>
              <div class="col-4 q-pa-md" align="center">
                <q-btn
                  class="bg5 rounded-borders fit row"
                  push
                  no-caps
                  @click="gotoHomeworkScore()"
                >
                  <div class="q-pa-md col-12">
                    <img src="../../statics/Home.png" style="width:100%" alt />
                  </div>
                  <div class="text-h6 color2">คะแนนการบ้าน</div>
                </q-btn>
              </div>
            </div>
          </div>
          <div
            class="col-md-3 col-xs-6 border-lef-box"
            align="center"
            :style="$q.platform.is.desktop ? 'border-left: 3px dashed rgba(0, 0, 0, 0.4)' : 'border'"
          >
            <div class="row">
              <div class="col-12" align="center">
                <span class="text-h5">ทบทวน O-NET {{ this.$q.platform.is.mobile }}</span>
              </div>
              <div class="col-12 q-pa-md" align="center">
                <q-btn class="bg5 rounded-borders row" push no-caps @click="gotoOnetReviewScore()">
                  <div class="q-pa-md col-12">
                    <img src="../../statics/onet-review.png" style="width:100%" alt />
                  </div>
                  <div class="text-h6 color2">ความก้าวหน้า</div>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <div align="center" class="q-pt-xl">
          <q-btn
            push
            label="ย้อนกลับ"
            style="width:300px"
            class="bg2 color1"
            @click="previousPage()"
          ></q-btn>
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
      teacherData: this.$q.localStorage.getItem("teacherData")
    };
  },
  methods: {
    previousPage() {
      this.$router.push(this.$q.localStorage.getItem("previousPage"));
    },
    gotoTop3() {
      this.$router.push("/rankingtop3");
    },
    gotoScore() {
      this.$router.push("/teacherScore");
    },
    gotoHomeworkScore() {
      this.$router.push("/teacherHomeworkScore");
    },
    gotoOnetReviewScore() {
      this.$router.push("/teacherReviewScore");
    }
  },
  mounted() {
    this.checkTeacherPermission();
  }
};
</script>

<style>
.duration-flash {
  animation-duration: 2s;
}
.border-left-box {
  border-left: 3px dashed rgba(0, 0, 0, 0.4);
}
</style>