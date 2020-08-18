<template>
  <div>
    <app-bar></app-bar>
    <div class="maindiv">
      <div class="bg10 text-h5 q-py-md text-white" align="center">แบบฝึกหัด</div>
      <div class="bg8">
        <div class="row justify-center">
          <div class="row q-pa-md text-center" style="width:650px">
            <div class="col-2 brx">1</div>
            <div class="col-2 brx">2</div>
            <div class="col-2 brx">3</div>
            <div class="col-2 brx">4</div>
            <div class="col-2 brx">5</div>

            <div class="brx q-mx-sm q-px-sm">
              <i class="far fa-clock"></i>00:20
            </div>
          </div>
        </div>

        <div
          class="bg9 text-h6"
        >On Songkran day, most Thai people go to their hometown to visit their parents. On which holiday do British people do the same ?</div>
      </div>

      <div class="row">
        <div class="col-6 brx">1</div>
        <div class="col-6 brx">2</div>
        <div class="col-6 brx">3</div>
        <div class="col-6 brx">4</div>
      </div>
    </div>
  </div>
</template>

<script>
import appBar from "../components/appbar.vue";
export default {
  components: {
    appBar
  }
};
</script>

<style scoped>
.brx {
  border: 1px solid red;
}
</style>