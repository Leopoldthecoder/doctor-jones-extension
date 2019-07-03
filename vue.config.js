module.exports = {
  css: {
    extract: false
  },
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
        background: false,
        contentScripts: true,
        popup: true
      },
      api: "chrome",
      usePolyfill: false,
      autoImportPolyfill: false,
      componentOptions: {
        contentScripts: {
          entries: {
            content: "src/content_scripts/index.js"
          }
        }
      }
    }
  }
};
