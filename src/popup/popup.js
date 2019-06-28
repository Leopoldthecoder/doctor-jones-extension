import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import App from "./App";
import store from "../store";
import router from "./router";

Vue.use(Vuetify, {
  theme: {
    primary: "#12d3cf",
    secondary: "#fcf9ec",
    accent: "#67eaca"
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});
