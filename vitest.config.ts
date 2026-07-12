import { defineConfig } from 'vitest/config'

// A dedicated Vitest config so the extension build plugin
// (vite-plugin-web-extension) does not run during unit tests. Tests target the
// pure helpers in src/popup/utils.ts and the Pinia store; jsdom provides the
// `location`/DOM globals that utils.ts relies on.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
  },
})
