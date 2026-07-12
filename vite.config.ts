import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import webExtension from 'vite-plugin-web-extension'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

// The extension is built by vite-plugin-web-extension, which reads the manifest
// at src/manifest.json (Manifest V3), discovers its HTML/JS entry points (popup
// + content script referenced by source path), bundles them, and rewrites the
// emitted manifest.
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    webExtension({
      manifest: 'src/manifest.json',
      browser: 'chrome',
      // Keep the extension version single-sourced in package.json (the previous
      // Vue CLI plugin injected it automatically; this plugin does not).
      transformManifest(manifest) {
        manifest.version = pkg.version
        return manifest
      },
      // Load the built dist/ unpacked manually (see README / verification steps)
      // rather than having web-ext drive a browser instance.
      disableAutoLaunch: true,
    }),
  ],
})
