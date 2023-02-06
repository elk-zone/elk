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

export {}
