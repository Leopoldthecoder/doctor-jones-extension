<template>
  <div class="popup">
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<style lang="stylus" scoped>
.popup
  width 400px
  height 600px
  text-shadow 0 0 10px #12d3cf
</style>

<script>
import * as types from "../store/mutation-types";

export default {
  mounted() {
    chrome.storage.sync.get(["FORMAT_OPTIONS"], result => {
      if (result && result["FORMAT_OPTIONS"]) {
        this.$store.commit(types.RESET_OPTIONS, result["FORMAT_OPTIONS"]);
      }
    });
  }
};
</script>
