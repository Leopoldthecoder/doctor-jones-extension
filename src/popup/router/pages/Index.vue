<template>
  <div class="main">
    <img src="./logo.png" alt="logo" />
    <v-btn color="primary" @click.native="onFormatClick">{{
      formatText
    }}</v-btn>
    <v-btn color="primary" @click.native="onRevokeClick">{{
      revokeText
    }}</v-btn>
    <v-btn color="primary" @click.native="openService">{{ serviceText }}</v-btn>
    <v-btn color="accent" @click.native="openOptions">{{ optionText }}</v-btn>
    <footer>
      <a
        href="https://github.com/Leopoldthecoder/doctor-jones-extension/issues"
        target="_blank"
        >💡{{ issueText }}</a
      >
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { messageType } from "../../../const";
import { getActiveTab } from "../../utils";

export default {
  computed: {
    ...mapState(["options"]),

    formatText() {
      return chrome.i18n.getMessage("format");
    },

    revokeText() {
      return chrome.i18n.getMessage("revoke");
    },

    serviceText() {
      return chrome.i18n.getMessage("service");
    },

    optionText() {
      return chrome.i18n.getMessage("options");
    },

    issueText() {
      return chrome.i18n.getMessage("issues");
    }
  },

  methods: {
    async onFormatClick() {
      const tab = await getActiveTab();
      chrome.tabs.sendMessage(tab.id, {
        type: messageType.format,
        options: this.options || {}
      });
    },

    async onRevokeClick() {
      const tab = await getActiveTab();
      chrome.tabs.sendMessage(tab.id, {
        type: messageType.revoke
      });
    },

    openService() {
      this.$router.push("/service");
    },

    openOptions() {
      this.$router.push("/options");
    }
  }
};
</script>

<style lang="stylus" scoped>
text-color=#fcf9ec
.main
  display flex
  flex-direction column
  align-items center

  h1
    color text-color
    margin 20px 0 50px

  img
    height 100px
    filter drop-shadow(0 0 30px #12d3cf)
    margin 90px 0

  button.v-btn
    color text-color
    width 200px

  footer
    position fixed
    bottom 0
    width 100%
    text-align center
    height 60px
    line-height 60px

    a
      text-decoration none
</style>
