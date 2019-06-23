module.exports = {
  pages: {
    "popup/popup": {
      entry: "src/popup/popup.js",
      title: "Popup"
    }
  },
  pluginOptions: {
    browserExtension: {
      registry: undefined,
      components: {
        background: true,
        popup: true
      },
      api: "chrome",
      usePolyfill: false,
      autoImportPolyfill: false,
      componentOptions: {
        background: {
          entry: "src/background.js"
        }
      }
    }
  }
};
