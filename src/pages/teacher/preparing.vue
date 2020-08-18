<template>
  <div>
    <teacher-bar :isShowBackBtn="true" :backtopagename="'/teacherStudyplan'"></teacher-bar>
    <div class="row justify-center items-center animated fadeIn">
      <div class="maindiv q-pa-md">
        <div class="text-center bg-transparent relative-position" style="bottom:-15px">
          <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
          <div class="absolute-full flex flex-center color1 text-h5">แบบทดสอบ</div>
        </div>
        <div class="bg8 q-pt-lg borders1-sm borders-rb q-mx-sm q-pr-sm" align="center">
          <div class="row justify-center items-center me-scrollbar">
            <div>
              <div class="q-pb-xl q-px-sm">
                <span class="me-text-stroke" v-if="this.$route.params.type == '1'">
                  เตรียมตัวทำ
                  <br />แบบทดสอบ
                </span>
                <span class="me-text-stroke" v-else>
                  เตรียมตัว
                  <br />ทำข้อสอบ
                </span>
              </div>
            </div>
            <div align="center" class="col-12">
              <q-btn
                label="เริ่มทำ"
                style="width:350px"
                class="bg5 color2 text-h6"
                @click="startTest()"
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
      teacherData: this.$q.localStorage.getItem("teacherData")
    };
  },
  methods: {
    startTest() {
      this.showLoading();
      let practiceType = this.$route.params.type == 1 ? "ทดสอบ" : "ข้อสอบ";
      db.collection("Synchronize")
        .doc(this.$q.localStorage.getItem("teacherData").key)
        .update({
          practiceType: practiceType
        })
        .then(() => {
          this.hideLoading();
          if (this.$route.params.type == 1) {
            // ทดสอบ
            this.$router.push("/teacherTest/" + this.$route.params.key);
          } else {
            // ข้อสอบ
            this.$router.push("/teacherCountdown/" + this.$route.params.key);
          }
        });
    }
  },
  mounted() {}
};
</script>

<style scoped>
.me-scrollbar {
  height: fit-content;
  min-height: calc(100vh - 280px);
}
.me-text-stroke {
  font-size: 100px;
  letter-spacing: 5px;
  color: #fce0c7;
  text-shadow: rgb(53, 53, 53) 6px 0px 0px,
    rgb(53, 53, 53) 5.91686px 0.995377px 0px,
    rgb(53, 53, 53) 5.66974px 1.96317px 0px,
    rgb(53, 53, 53) 5.2655px 2.87655px 0px,
    rgb(53, 53, 53) 4.71532px 3.71022px 0px,
    rgb(53, 53, 53) 4.03447px 4.44106px 0px,
    rgb(53, 53, 53) 3.24181px 5.04883px 0px,
    rgb(53, 53, 53) 2.35931px 5.51667px 0px,
    rgb(53, 53, 53) 1.41143px 5.83163px 0px,
    rgb(53, 53, 53) 0.424423px 5.98497px 0px,
    rgb(53, 53, 53) -0.574341px 5.97245px 0px,
    rgb(53, 53, 53) -1.55719px 5.79441px 0px,
    rgb(53, 53, 53) -2.49688px 5.45578px 0px,
    rgb(53, 53, 53) -3.36738px 4.96596px 0px,
    rgb(53, 53, 53) -4.14455px 4.33852px 0px,
    rgb(53, 53, 53) -4.80686px 3.59083px 0px,
    rgb(53, 53, 53) -5.33596px 2.74364px 0px,
    rgb(53, 53, 53) -5.71718px 1.8204px 0px,
    rgb(53, 53, 53) -5.93995px 0.84672px 0px,
    rgb(53, 53, 53) -5.99811px -0.150428px 0px,
    rgb(53, 53, 53) -5.89004px -1.14341px 0px,
    rgb(53, 53, 53) -5.61874px -2.1047px 0px,
    rgb(53, 53, 53) -5.19172px -3.00766px 0px,
    rgb(53, 53, 53) -4.62082px -3.82727px 0px,
    rgb(53, 53, 53) -3.92186px -4.54081px 0px,
    rgb(53, 53, 53) -3.11421px -5.12852px 0px,
    rgb(53, 53, 53) -2.22026px -5.57409px 0px,
    rgb(53, 53, 53) -1.26477px -5.86518px 0px,
    rgb(53, 53, 53) -0.274238px -5.99373px 0px,
    rgb(53, 53, 53) 0.723898px -5.95617px 0px,
    rgb(53, 53, 53) 1.70197px -5.75355px 0px,
    rgb(53, 53, 53) 2.63288px -5.39147px 0px,
    rgb(53, 53, 53) 3.49082px -4.87998px 0px,
    rgb(53, 53, 53) 4.25202px -4.23324px 0px,
    rgb(53, 53, 53) 4.89538px -3.46919px 0px,
    rgb(53, 53, 53) 5.40307px -2.60899px 0px,
    rgb(53, 53, 53) 5.76102px -1.67649px 0px,
    rgb(53, 53, 53) 5.95932px -0.697531px 0px;
}
</style>