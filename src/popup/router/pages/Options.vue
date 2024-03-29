<template>
  <div class="options">
    <h1>
      <i class="material-icons" @click="navigateBack">arrow_back</i>
      {{ titleText }}
    </h1>
    <section class="options-container">
      <section class="options-group">
        <h2 class="options-group-title">{{ generalOptionsText }}</h2>
        <v-switch
          :label="generalLabelText.autoFormat"
          :input-value="options.autoFormat"
          @change="
            v => {
              onChange(v, 'autoFormat');
              onAutoFormatChange(v);
            }
          "
        ></v-switch>
        <template v-if="options.autoFormat">
          <p class="option-label">{{ generalLabelText.blacklist }}</p>
          <v-textarea
            solo
            no-resize
            :placeholder="generalLabelText.blacklistPlaceholder"
            :value="options.blacklist"
            @change="
              v => {
                onChange(v, 'blacklist', false);
              }
            "
          ></v-textarea>
        </template>
      </section>
      <section class="options-group">
        <h2 class="options-group-title">{{ formatOptionsText }}</h2>
        <v-switch
          :label="formatLabelText.spacing"
          :input-value="options.spacing"
          @change="
            v => {
              onChange(v, 'spacing');
            }
          "
        ></v-switch>
        <v-switch
          :label="formatLabelText.spaceBetweenFullwidthPunctuationAndAlphabets"
          :input-value="options.spaceBetweenFullwidthPunctuationAndAlphabets"
          @change="
            v => {
              onChange(v, 'spaceBetweenFullwidthPunctuationAndAlphabets');
            }
          "
        ></v-switch>
        <v-switch
          :label="formatLabelText.successiveExclamationMarks"
          row
          :input-value="options.successiveExclamationMarks"
          @change="
            v => {
              onChange(v, 'successiveExclamationMarks');
            }
          "
        ></v-switch>
        <v-switch
          :label="formatLabelText.halfwidthParenthesisAroundNumbers"
          :input-value="options.halfwidthParenthesisAroundNumbers"
          @change="
            v => {
              onChange(v, 'halfwidthParenthesisAroundNumbers');
            }
          "
        ></v-switch>
        <v-select
          :label="formatLabelText.ellipsisTolerance"
          :items="ellipsisOptions"
          :value="options.ellipsisTolerance"
          @change="
            v => {
              onChange(v, 'ellipsisTolerance');
            }
          "
        ></v-select>
        <v-select
          :label="formatLabelText.replaceWithCornerQuotes"
          :items="quotationOptions"
          :value="options.replaceWithCornerQuotes"
          @change="
            v => {
              onChange(v, 'replaceWithCornerQuotes');
            }
          "
        ></v-select>
      </section>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as types from "../../../store/mutation-types";
import { messageType } from "../../../const";
import { getActiveTab } from "../../utils";

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

    generalOptionsText() {
      return chrome.i18n.getMessage("generalOptions");
    },

    formatOptionsText() {
      return chrome.i18n.getMessage("formatOptions");
    },

    generalLabelText() {
      return {
        autoFormat: chrome.i18n.getMessage("autoFormat"),
        blacklist: chrome.i18n.getMessage("blacklist"),
        blacklistPlaceholder: chrome.i18n.getMessage("blacklistPlaceholder")
      };
    },

    formatLabelText() {
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

    onChange(v, key, convertToBool = true) {
      this.$store.commit(types.UPDATE_OPTIONS, {
        value: convertToBool ? v || !!v : v,
        key
      });
      chrome.storage.sync.set({ FORMAT_OPTIONS: this.options });
    },

    async onAutoFormatChange(v) {
      const tab = await getActiveTab();
      chrome.tabs.sendMessage(tab.id, {
        type: messageType[v ? "startAutoFormat" : "stopAutoFormat"]
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.options
  padding-bottom 20px
  height 600px
  display flex
  flex-direction column

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

      &.v-textarea
        textarea
          color rgba(255, 255, 255, .7)
          margin-bottom 12px
          line-height 1.6

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

.options-container
  overflow auto
  flex 1

.options-group
  margin-bottom 50px

.options-group-title
  margin 0 20px 20px

.option-label
  padding: 0 20px
  margin-top 16px
  color rgba(255, 255, 255, .7)
</style>
