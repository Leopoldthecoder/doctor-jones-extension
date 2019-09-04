<template>
  <div class="service">
    <h1>
      <i class="material-icons" @click="navigateBack">arrow_back</i>
      {{ titleText }}
    </h1>
    <section class="service-container">
      <label class="service-label">{{ inputLabel }}</label>
      <v-textarea
        solo
        no-resize
        :placeholder="inputPlaceholder"
        @input="onInput"
      ></v-textarea>
      <label class="service-label">{{ outputLabel }}</label>
      <v-textarea
        solo
        no-resize
        readonly
        :placeholder="outputPlaceholder"
        :value="formattedText"
      ></v-textarea>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dj from "doctor-jones";

export default {
  data() {
    return {
      formattedText: ""
    };
  },

  computed: {
    ...mapState(["options"]),

    titleText() {
      return chrome.i18n.getMessage("service");
    },

    inputLabel() {
      return chrome.i18n.getMessage("serviceInputLabel");
    },

    outputLabel() {
      return chrome.i18n.getMessage("serviceOutputLabel");
    },

    inputPlaceholder() {
      return chrome.i18n.getMessage("serviceInputPlaceholder");
    },

    outputPlaceholder() {
      return chrome.i18n.getMessage("serviceOutputPlaceholder");
    }
  },

  methods: {
    navigateBack() {
      this.$router.back();
    },

    onInput(v) {
      this.formattedText = dj(v, this.options);
    }
  }
};
</script>

<style lang="stylus" scoped>
.service
  padding-bottom 20px
  height 600px
  display flex
  flex-direction column

  >>>
    .v-input
      padding 0 20px

    .v-text-field.v-textarea
      textarea
        color rgba(255, 255, 255, .7)
        margin-bottom 12px
        line-height 1.4
        font-size 14px

  h1
    text-align center
    margin 30px 0
    position relative

    i
      position absolute
      left 20px
      top 4px
      cursor pointer

.service-container
  overflow auto
  flex 1

.service-label
  padding 0 20px
  font-size 16px
  margin-bottom 15px
  display block
</style>
