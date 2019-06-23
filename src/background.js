import store from "./store";

chrome.browserAction.onClicked.addListener(function() {
  console.log(`Hello ${store.getters.foo}!`);
});
