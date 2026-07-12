/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >
  export default component
}

// The `doctor-jones` formatting library ships no type declarations.
declare module 'doctor-jones' {
  const dj: (text: string, options?: object) => string
  export default dj
}
