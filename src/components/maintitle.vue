<template>
  <div>
    <q-img
      src="../statics/images/Bar.png"
      class
      style="max-width:1200px;width:100%;margin:auto;z-index:150;border:2px solid transparent;"
    >
      <q-toolbar class="bg-transparent" align="center">
        <q-toolbar-title>
          <span class="text-h5">{{dataTitle}}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-img>
  </div>
</template>

<script>
export default {
  props: ["dataTitle"]
};
</script>