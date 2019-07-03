import * as types from "./mutation-types";

export default {
  [types.RESET_OPTIONS](state, payload) {
    state.options = payload;
  },

  [types.UPDATE_OPTIONS](state, payload) {
    state.options[payload.key] = payload.value;
  }
};
