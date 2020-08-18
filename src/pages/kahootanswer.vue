<template>
  <div class="bgimage">
    <div class="q-pa-md text-h5 bg-secondary titlediv text-white">Winner O-net | อธิวราห์ คงมาลัย</div>
    <div class="maindiv shadow-4">
      <div class="text-center box1 text-h5 text-white q-pt-md">แบบฝึกหัด</div>
      <div class="questionNo row brx">
        <div
          style="width:20%"
          class="cornerdiv bg-secondary text-white text-center text-h6 q-pt-sm"
        >1</div>
        <div
          style="width:20%"
          class="insidediv bg-secondary text-white text-center text-h6 q-pt-sm"
        >2</div>
        <div
          style="width:20%"
          class="insidediv bg-secondary text-white text-center text-h6 q-pt-sm"
        >3</div>
        <div style="width:20%" class="insidediv"></div>
        <div style="width:20%" class="insidediv"></div>
      </div>
      <div class="answerzonediv row">
        <q-btn class="bigbtn q-mb-lg btn-a text-h2" push>
          <b>A</b>
        </q-btn>
        <div style="width:40px;"></div>
        <q-btn class="bigbtn q-mb-lg btn-b text-h2" push>
          <b>B</b>
        </q-btn>

        <q-btn class="bigbtn q-mb-lg bg-indigo-7 text-white text-h2" push>
          <b>C</b>
        </q-btn>
        <div style="width:40px;"></div>
        <q-btn class="bigbtn q-mb-lg bg-yellow-8 text-white text-h2" push>
          <b>D</b>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.brx {
  border: 1px solid red;
}
.bgimage {
  background-image: url(../assets/background.jpg);
  background-size: cover;
  /* background-repeat: no-repeat; */
  width: 100%;
  height: 100vh;
}
.box1 {
  background-color: #f48f84;
  height: 65px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.maindiv {
  width: 95%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  top: 40px;
  height: calc(100vh - 145px);
  background-color: #fcf1e9;
  border-radius: 10px;
}
.titlediv {
  height: 65px;
}
.questionNo {
  width: calc(100% - 80px);
  max-width: 800px;
  border: 2px solid black;
  border-radius: 10px;
  height: 50px;
  margin: auto;
  position: relative;
  top: 40px;
}
.insidediv {
  border-left: 1px solid black;
}
.cornerdiv {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.answerzonediv {
  position: relative;
  top: 60px;
  width: calc(100% - 80px);
  margin: auto;
}
.bigbtn {
  width: calc(50% - 20px);
  height: calc(50vh - 190px);
}
.btn-a {
  background-color: #f48f84;
  color: white;
}
.btn-b {
  background-color: #03a9f4;
  color: white;
}
</style>