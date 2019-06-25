<template>
  <div class="main">
    <h1>{{ title }}</h1>
    <v-btn color="primary" @click.native="onClick">{{ confirmFormat }}</v-btn>
    <v-btn color="accent" @click.native="openOpetions">Options</v-btn>
    <footer>
      <a
        href="https://github.com/Leopoldthecoder/doctor-jones-extension"
        target="_blank"
        >GitHub</a
      >
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    title() {
      return chrome.i18n.getMessage("extName");
    },

    confirmFormat() {
      return chrome.i18n.getMessage("confirmFormat");
    }
  },

  methods: {
    onClick() {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {});
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.main
  width 400px
  height 300px
  display flex
  flex-direction column
  align-items center
  background linear-gradient(#fcf9ec, rgba(176, 244, 230, .3))

  h1
    color #333
    margin 20px 0 50px

  button.v-btn
    color #fcf9ec
    width 200px

  footer
    position fixed
    bottom 0
    width 100%
    text-align center
    height 60px
    line-height 60px
</style>
