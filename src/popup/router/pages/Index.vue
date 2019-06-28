<template>
  <div class="main">
    <h1>{{ titleText }}</h1>
    <v-btn color="primary" @click.native="onFormatClick">{{
      formatText
    }}</v-btn>
    <v-btn color="primary" @click.native="onRevokeClick">{{
      revokeText
    }}</v-btn>
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

export default {
  data() {
    return {
      activeTab: null
    };
  },

  computed: {
    ...mapState(["options"]),
    titleText() {
      return chrome.i18n.getMessage("extName");
    },

    formatText() {
      return chrome.i18n.getMessage("format");
    },

    revokeText() {
      return chrome.i18n.getMessage("revoke");
    },

    optionText() {
      return chrome.i18n.getMessage("options");
    },

    issueText() {
      return chrome.i18n.getMessage("issues");
    }
  },

  methods: {
    getTab() {
      if (!this.activeTab) {
        this.activeTab = new Promise(resolve => {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            resolve(tabs[0]);
          });
        });
      }
      return this.activeTab;
    },

    async onFormatClick() {
      const tab = await this.getTab();
      chrome.tabs.sendMessage(tab.id, {
        type: messageType.format,
        options: this.options || {}
      });
    },

    async onRevokeClick() {
      const tab = await this.getTab();
      chrome.tabs.sendMessage(tab.id, {
        type: messageType.revoke
      });
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
