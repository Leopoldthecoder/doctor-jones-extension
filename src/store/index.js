import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    options: {
      // 通用选项
      autoFormat: false,

      // 格式化选项
      spacing: true,
      spaceBetweenFullwidthPunctuationAndAlphabets: false,
      successiveExclamationMarks: false,
      ellipsisTolerance: "none",
      replaceWithCornerQuotes: "double",
      halfwidthParenthesisAroundNumbers: true
    }
  },
  mutations
});
