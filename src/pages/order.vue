<template>
  <!-- main background -->
  <div class="bgimage">
    <div class="head1 text-white text-h6 q-pa-md">Winner O-Net | อธิวราห์ คงมาลัย</div>

    <div class="maindiv brx">
      <div class="head2 text-center q-pt-xs text-h6 text-white">แบบทดสอบ</div>
      <div class="bigblock absolute-center text-h4 q-pt-xl">
        <div class="absolute-center">จงเลือกคำตอบที่ถูกต้อง</div>
      </div>
      <div class="absolute-bottom q-mb-lg" align="center">
        <q-btn color="secondary" style="width:300px">ถัดไป</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.bgimage {
  background-image: url(../assets/background.jpg);
  background-size: cover;
  /* background-repeat: no-repeat; */
  width: 100%;
  height: 100vh;
}
.brx {
  border: 1px solid red;
}
.head1 {
  height: 60px;
  background-color: #0a9e9c;
}
.head2 {
  height: 40px;
  background-color: #f59085;
  border-radius: 10px;
}
.maindiv {
  width: 95%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  top: 40px;
  height: calc(100vh - 120px);
  background-color: #fff0e2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.bigblock {
  width: 50%;
  height: calc(100vh - 500px);
  background-color: rgb(253, 215, 143);

  border-radius: 20px;
  border: 2px dashed orange;
  /* outline-style: dashed;
  outline-color: orange; */
  -moz-outline-radius: 50px;
}
</style>