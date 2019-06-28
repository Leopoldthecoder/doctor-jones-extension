import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    options: {
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
