<template>
  <q-page class="row justify-center items-center animated fadeIn">
    <div class="maindiv q-pa-md">
      <div class="text-center bg-transparent relative-position" style="bottom:-15px">
        <img src="../../statics/images/Bar.png" style="width:100%;height:70px" />
        <div class="absolute-full flex flex-center">
          <span class="color1 text-h5" v-if="!isLoad">
            <span v-if="scoreTypeStar == ''">ตารางคะแนนเก็บนักเรียน</span>
            <span v-else>ความก้าวหน้า - ทบทวน O-NET</span>
          </span>
        </div>
      </div>
      <div class="bg8 q-pt-lg borders1-sm borders-rb q-mx-sm q-pr-sm" align="center">
        <div class="q-pl-md q-pr-sm me-scrollbar">
          <table class="table-spacing">
            <tr class="text-body1">
              <td class="table-sticky">
                <div align="center" class="q-pa-xs">
                  <span>เลขที่</span>
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="fas fa-caret-up"
                    v-if="isSortNo"
                    @click="sortNo(false)"
                  ></q-btn>
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="fas fa-caret-down"
                    v-if="!isSortNo"
                    @click="sortNo(true)"
                  ></q-btn>
                </div>
              </td>
              <td class="table-sticky">
                <div align="center" class="q-pa-xs">
                  <span>ชื่อ-นามสกุล</span>
                </div>
              </td>
              <td class="table-sticky">
                <div align="center" class="q-pa-xs">
                  <span v-if="scoreTypeStar == ''">คะแนน</span>
                  <span v-else>ความก้าวหน้า</span>
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="fas fa-caret-up"
                    v-if="isSortScore"
                    @click="sortScore(false)"
                  ></q-btn>
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="fas fa-caret-down"
                    v-if="!isSortScore"
                    @click="sortScore(true)"
                  ></q-btn>
                </div>
              </td>
            </tr>
            <tbody v-if="!isLoad">
              <tr v-for="(item,index) in dataStudentList" :key="index">
                <td style="width:100px;" class="bg9 borders-rtl borders-rbl" align="center">
                  <div class="q-pa-md">
                    <span>{{item.no}}</span>
                  </div>
                </td>
                <td class="bg9" align="left">
                  <div class="q-pl-xl">
                    <span>{{item.name}}</span>
                  </div>
                </td>
                <td style="width:200px;" class="bg9 borders-rtr borders-rbr">
                  <div align="center" v-if="scoreTypeStar == ''">
                    <span>{{item.score}}</span>
                  </div>
                  <div align="center" v-else>
                    <span>
                      <q-icon
                        name="fas fa-star"
                        size="sm"
                        v-for="i in item.score"
                        :key="i"
                        class="q-ml-xs color11"
                      ></q-icon>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="isLoad" class="q-pt-xl q-mt-xl">
            <q-spinner-dots color="red-3" size="100px" />
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
      dataStudentList: [],
      scoreTypeStar: "",
      isLoad: false,
      isSortNo: false,
      isSortScore: false
    };
  },
  methods: {
    sortNo(bool) {
      this.isSortNo = bool;
      this.isSortScore = false;
      this.dataStudentList.sort((a, b) => {
        if (bool) {
          return b.no - a.no;
        } else {
          return a.no - b.no;
        }
      });
    },
    sortScore(bool) {
      this.isSortScore = bool;
      this.isSortNo = false;
      this.dataStudentList.sort((a, b) => {
        if (bool) {
          return b.score - a.score;
        } else {
          return a.score - b.score;
        }
      });
    },
    loadStudent() {
      this.isLoad = true;

      let teacherKey = this.$q.localStorage.getItem("teacherRoomKey");

      this.dataStudentList = [];

      db.collection("Synchronize")
        .doc(teacherKey)
        .collection("ShowScore")
        .doc("score")
        .get()
        .then(data => {
          if (data.exists) {
            this.dataStudentList = data.data().show;
            if (data.data().type != undefined) {
              this.scoreTypeStar = data.data().type;
            }
          }
          this.isLoad = false;
        });
    }
  },
  mounted() {
    this.loadStudent();
  }
};
</script>

<style scoped>
.me-scrollbar {
  height: calc(100vh - 220px);
  overflow-y: auto;
}
/* width */
.me-scrollbar::-webkit-scrollbar {
  width: 15px;
}

/* Track */
.me-scrollbar::-webkit-scrollbar-track {
  background-color: #fce0c7;
  border: 4px solid #fff0e2;
  border-radius: 10px;
}

/* Handle */
.me-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f59085;
  border-radius: 10px;
}

/* Handle on hover */
.me-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #f88477;
}

.table-spacing {
  width: 100%;
  border-spacing: 8px;
}

.table-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: #fff0e2;
  padding: 10px 0px;
}
</style>