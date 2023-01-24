/// <reference types="@types/wicg-file-system-access" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />

declare global {
  namespace NodeJS {
    interface Process {
      test?: boolean
    }
  }
}

declare module 'nuxt/dist/app/nuxt.d.ts' {
  interface RuntimeNuxtHooks {
    'elk-logo:click': () => void
  }
}

export {}
