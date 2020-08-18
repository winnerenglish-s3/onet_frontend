<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div v-if="isLoading">
      <q-spinner-dots class="color10 q-mt-xl" size="100px" />
    </div>
    <div style="width:100%;max-width:450px;" class="q-pa-md animated zoomIn" v-if="!isLoading">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/bar login.png" style="width:100%;height:150px;" />
        <div class="absolute-center" style="bottom:90px;" v-if="practiceType != 'rankingtop3'">
          <img src="../../statics/images/ribbon.png" style="width:180px;height:160px;" />
        </div>
        <div
          class="absolute-center"
          style="bottom:90px;"
          v-if="scoreRanking == -1 && practiceType == 'rankingtop3'"
        >
          <img src="../../statics/images/ribbon.png" style="width:180px;height:160px;" />
        </div>
        <div
          class="absolute-center animated fadeIn"
          style="bottom:-20px;"
          v-if="scoreRanking == 0 && practiceType == 'rankingtop3'"
        >
          <img src="../../statics/1st.png" style="width:180px;" />
        </div>
        <div
          class="absolute-center animated fadeIn"
          style="bottom:-20px;"
          v-if="scoreRanking == 1 && practiceType == 'rankingtop3'"
        >
          <img src="../../statics/2nd.png" style="width:180px;" />
        </div>
        <div
          class="absolute-center animated fadeIn"
          style="bottom:-20px;"
          v-if="scoreRanking == 2 && practiceType == 'rankingtop3'"
        >
          <img src="../../statics/3rd.png" style="width:180px;" />
        </div>
      </div>

      <div class="row bg9 borders-rb borders1-md">
        <div class="col-12 q-pt-xl q-px-xl q-pb-md" align="center">
          <div class="q-mt-xl q-mb-lg relative-position bg8 me-score" align="center">
            <div class="absolute-center full-width">
              <span class style="font-size:30px;">ได้คะแนน</span>
              <div>
                <span class="text-bold color4 me-font-score">{{score}}</span>
              </div>
            </div>
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
      student: this.$q.localStorage.getItem("studentData"),
      practiceType: this.$q.localStorage.getItem("practiceType"),
      score: 0,
      scoreRanking: null,

      // Loading
      isLoading: false
    };
  },
  methods: {
    loadScore() {
      this.isLoading = true;

      let practiceKey = this.$q.localStorage.getItem("practiceKey");
      let practiceType = this.$q.localStorage.getItem("practiceType");
      let teacherKey = this.$q.localStorage.getItem("teacherRoomKey");

      if (practiceType == "rankingtop3") {
        this.isLoading = true;
        db.collection("studentScoreLog")
          .where("academicKey", "==", this.student.year)
          .where("studentKey", "==", this.student.key)
          .get()
          .then(docScore => {
            if (docScore.size > 0) {
              docScore.forEach(dataScore => {
                this.score += dataScore.data().scoreRaw;
              });

              db.collection("Synchronize")
                .doc(teacherKey)
                .collection("top3")
                .doc("score")
                .get()
                .then(data => {
                  if (data.exists) {
                    this.scoreRanking = data
                      .data()
                      .show.map(item => {
                        return item.score;
                      })
                      .indexOf(this.score);
                  }
                  this.isLoading = false;
                });
            }
          });
      } else {
        db.collection("studentScoreLog")
          .where("academicKey", "==", this.student.year)
          .where("studentKey", "==", this.student.key)
          .where("practiceKey", "==", practiceKey)
          .get()
          .then(data => {
            if (data.size > 0) {
              db.collection("studentScoreLog")
                .doc(data.docs[0].id)
                .update({
                  checkScore: true
                });

              let dataAnswer = data.docs[0].data().dataAnswerList;
              for (let i = 0; i < dataAnswer.length; i++) {
                if (dataAnswer[i].status == "ถูก") {
                  this.score += 1;
                }
              }
            }
            this.isLoading = false;
          });
      }
    }
  },
  mounted() {
    let practiceKey = this.$q.localStorage.getItem("practiceKey");

    if (practiceKey) {
      this.loadScore();
    }
  }
};
</script>

<style scoped>
.me-score {
  border: 1px dashed #f59085;
  border-width: 2px;
  border-radius: 20px;
  width: 250px;
  height: 200px;
}
.me-font-score {
  font-size: 70px;
}
</style>