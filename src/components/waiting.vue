<template>
  <div class="animated fadeIn">
    <div class="row justify-center items-center me-scrollbar">
      <!-- SECTION เตรียมตัวทำแบบทดสอบ -->
      <div v-if="setType == 'ready'" style="font-size: 120px;">
        <div class="q-pt-lg q-px-sm">
          <span class="me-text-stroke">เตรียมตัว</span>
        </div>
        <div class="q-pb-xl q-px-sm">
          <span class="me-text-stroke">ทำแบบทดสอบ</span>
        </div>
      </div>

      <!-- SECTION  ตั้งใจฟังคุณครู -->
      <div v-if="setType == 'listen'" style="font-size: 120px;">
        <div class="q-pt-lg q-px-sm">
          <span class="me-text-stroke">ตั้งใจฟังคุณครู</span>
        </div>
        <div class="q-pb-xl q-px-sm">
          <span class="me-text-stroke">กันก่อนนะ</span>
        </div>
      </div>

      <!-- SECTION  ข้อสอบ -->
      <div v-if="setType == 'waitexam'" style="font-size: 120px;">
        <div class="q-pt-lg q-px-sm">
          <span class="me-text-stroke">เตรียมตัว</span>
        </div>
        <div class="q-pb-xl q-px-sm">
          <span class="me-text-stroke">ทำข้อสอบ</span>
        </div>
      </div>

      <!-- SECTION  รอสักครู่ -->
      <div v-if="setType == 'waiting'" style="font-size: 80px;">
        <div class="q-pt-md">
          <q-spinner-dots class="color10" size="100px" />
        </div>
        <div class="q-pb-xl q-px-sm">
          <span class="me-text-stroke">รอสักครู่</span>
        </div>
      </div>

      <!-- SECTION  รอเพื่อนทำก่อนนะ -->
      <div v-if="setType == 'waitfriend'" style="font-size: 80px;">
        <div class="q-pt-md q-pb-xl">
          <q-spinner-dots class="color10" size="100px" />
        </div>
        <div class="q-pb-xl">
          <span class="me-text-stroke">รอเพื่อนทำก่อนนะ</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["setType"]
};
</script>

<style scoped>
.me-scrollbar {
  height: fit-content;
  min-height: calc(100vh - 280px);
}
.me-text-stroke {
  color: #fce0c7;
  text-shadow: rgb(51, 51, 51) 8px 0px 0px,
    rgb(51, 51, 51) 7.93758px 0.997398px 0px,
    rgb(51, 51, 51) 7.7513px 1.97923px 0px,
    rgb(51, 51, 51) 7.44406px 2.93018px 0px,
    rgb(51, 51, 51) 7.02066px 3.8354px 0px,
    rgb(51, 51, 51) 6.4877px 4.68078px 0px,
    rgb(51, 51, 51) 5.85351px 5.45311px 0px,
    rgb(51, 51, 51) 5.12797px 6.14035px 0px,
    rgb(51, 51, 51) 4.32242px 6.73177px 0px,
    rgb(51, 51, 51) 3.44941px 7.21814px 0px,
    rgb(51, 51, 51) 2.52258px 7.59188px 0px,
    rgb(51, 51, 51) 1.55638px 7.84714px 0px,
    rgb(51, 51, 51) 0.565898px 7.97996px 0px,
    rgb(51, 51, 51) -0.433417px 7.98825px 0px,
    rgb(51, 51, 51) -1.42597px 7.87189px 0px,
    rgb(51, 51, 51) -2.39627px 7.63269px 0px,
    rgb(51, 51, 51) -3.32917px 7.27438px 0px,
    rgb(51, 51, 51) -4.21013px 6.80256px 0px,
    rgb(51, 51, 51) -5.02539px 6.22459px 0px,
    rgb(51, 51, 51) -5.76223px 5.54948px 0px,
    rgb(51, 51, 51) -6.40915px 4.78778px 0px,
    rgb(51, 51, 51) -6.95606px 3.95136px 0px,
    rgb(51, 51, 51) -7.39442px 3.05329px 0px,
    rgb(51, 51, 51) -7.71739px 2.10757px 0px,
    rgb(51, 51, 51) -7.91994px 1.12896px 0px,
    rgb(51, 51, 51) -7.9989px 0.132735px 0px,
    rgb(51, 51, 51) -7.95304px -0.865561px 0px,
    rgb(51, 51, 51) -7.78307px -1.85035px 0px,
    rgb(51, 51, 51) -7.49165px -2.80627px 0px,
    rgb(51, 51, 51) -7.08333px -3.71839px 0px,
    rgb(51, 51, 51) -6.56448px -4.57249px 0px,
    rgb(51, 51, 51) -5.94318px -5.35524px 0px,
    rgb(51, 51, 51) -5.22915px -6.05442px 0px,
    rgb(51, 51, 51) -4.43352px -6.65912px 0px,
    rgb(51, 51, 51) -3.5687px -7.15991px 0px,
    rgb(51, 51, 51) -2.6482px -7.54898px 0px,
    rgb(51, 51, 51) -1.68637px -7.82024px 0px,
    rgb(51, 51, 51) -0.698222px -7.96947px 0px,
    rgb(51, 51, 51) 0.300817px -7.99434px 0px,
    rgb(51, 51, 51) 1.29516px -7.89446px 0px,
    rgb(51, 51, 51) 2.2693px -7.67139px 0px,
    rgb(51, 51, 51) 3.20802px -7.32862px 0px,
    rgb(51, 51, 51) 4.09668px -6.87148px 0px,
    rgb(51, 51, 51) 4.92142px -6.30711px 0px,
    rgb(51, 51, 51) 5.66936px -5.64432px 0px,
    rgb(51, 51, 51) 6.32883px -4.89346px 0px,
    rgb(51, 51, 51) 6.88954px -4.06623px 0px,
    rgb(51, 51, 51) 7.34274px -3.17555px 0px,
    rgb(51, 51, 51) 7.68136px -2.23532px 0px,
    rgb(51, 51, 51) 7.90012px -1.26021px 0px,
    rgb(51, 51, 51) 7.9956px -0.265434px 0px;
}
</style>