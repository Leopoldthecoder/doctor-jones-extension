import * as types from "./mutation-types";

export default {
  [types.UPDATE_OPTIONS](state, payload) {
    state.options[payload.key] = payload.value;
  }
};
