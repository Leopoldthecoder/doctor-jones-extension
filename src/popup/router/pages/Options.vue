<template>
  <div class="options">
    <h1>
      <i class="material-icons" @click="navigateBack">arrow_back</i>
      {{ titleText }}
    </h1>
    <v-switch
      :label="labelText.spacing"
      :input-value="options.spacing"
      @change="
        v => {
          onChange(v, 'spacing');
        }
      "
    ></v-switch>
    <v-switch
      :label="labelText.spaceBetweenFullwidthPunctuationAndAlphabets"
      :input-value="options.spaceBetweenFullwidthPunctuationAndAlphabets"
      @change="
        v => {
          onChange(v, 'spaceBetweenFullwidthPunctuationAndAlphabets');
        }
      "
    ></v-switch>
    <v-switch
      :label="labelText.successiveExclamationMarks"
      row
      :input-value="options.successiveExclamationMarks"
      @change="
        v => {
          onChange(v, 'successiveExclamationMarks');
        }
      "
    ></v-switch>
    <v-switch
      :label="labelText.halfwidthParenthesisAroundNumbers"
      :input-value="options.halfwidthParenthesisAroundNumbers"
      @change="
        v => {
          onChange(v, 'halfwidthParenthesisAroundNumbers');
        }
      "
    ></v-switch>
    <v-select
      :label="labelText.ellipsisTolerance"
      :items="ellipsisOptions"
      :value="options.ellipsisTolerance"
      @change="
        v => {
          onChange(v, 'ellipsisTolerance');
        }
      "
    ></v-select>
    <v-select
      :label="labelText.replaceWithCornerQuotes"
      :items="quotationOptions"
      :value="options.replaceWithCornerQuotes"
      @change="
        v => {
          onChange(v, 'replaceWithCornerQuotes');
        }
      "
    ></v-select>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as types from "../../../store/mutation-types";

export default {
  data() {
    return {
      ellipsisOptions: [
        {
          text: chrome.i18n.getMessage("ellipsisNone"),
          value: "none"
        },
        {
          text: chrome.i18n.getMessage("ellipsisDots"),
          value: "3dots"
        },
        {
          text: chrome.i18n.getMessage("ellipsisAll"),
          value: "all"
        }
      ],
      quotationOptions: [
        {
          text: chrome.i18n.getMessage("quotationDouble"),
          value: "double"
        },
        {
          text: chrome.i18n.getMessage("quotationSingle"),
          value: "single"
        },
        {
          text: chrome.i18n.getMessage("quotationNone"),
          value: "none"
        }
      ]
    };
  },

  computed: {
    ...mapState(["options"]),

    titleText() {
      return chrome.i18n.getMessage("options");
    },

    labelText() {
      return this.options
        ? Object.keys(this.options).reduce((acc, cur) => {
            acc[cur] = chrome.i18n.getMessage(cur);
            return acc;
          }, {})
        : {};
    }
  },

  methods: {
    navigateBack() {
      this.$router.back();
    },

    onChange(v, key) {
      this.$store.commit(types.UPDATE_OPTIONS, {
        value: v || !!v,
        key
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.options
  padding-bottom 20px

  >>>
    .v-input
      padding 0 20px

    .v-messages
      display none

    .v-input--switch .v-input__slot
      flex-direction row-reverse
      justify-content space-between

    .v-input--selection-controls .v-input__control
      flex-grow 1

    .v-label
      font-size 12px

    .v-text-field
      margin-top 30px

      .v-label
        overflow inherit

      .v-label--active
        transform translateY(-18px)

    .v-select__selections
      margin-top 6px

  h1
    text-align center
    margin 30px 0
    position relative

    i
      position absolute
      left 20px
      top 4px
      cursor pointer
</style>
