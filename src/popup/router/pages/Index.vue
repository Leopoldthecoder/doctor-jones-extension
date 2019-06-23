<template>
  <h1>{{ defaultText }}</h1>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    chrome.runtime.sendMessage({});
  },
  computed: {
    defaultText() {
      return chrome.i18n.getMessage("extName");
    }
  }
};
</script>
