/// <reference types="@types/wicg-file-system-access" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:build-info' {
  import type { BuildInfo } from '~/types'
  export const buildInfo: BuildInfo
}
