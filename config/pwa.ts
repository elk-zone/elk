import { isCI, isDevelopment } from 'std-env'
import type { VitePWANuxtOptions } from '../modules/pwa/types'

export const pwa: VitePWANuxtOptions = {
  mode: isCI ? 'production' : 'development',
  // disable PWA only when in preview mode
  disable: /* temporarily test in CI isPreview || */ (isDevelopment && process.env.VITE_DEV_PWA !== 'true'),
  scope: '/',
  srcDir: './service-worker',
  filename: 'sw.ts',
  strategies: 'injectManifest',
  injectRegister: false,
  includeManifestIcons: false,
  manifest: false,
  injectManifest: {
    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm,webmanifest}'],
    globIgnores: ['emojis/**', 'shiki/**'/* , 'manifest**.webmanifest', 'pwa-*.png', 'maskable-icon.png', 'shortcuts/**', 'screenshots/**' */],
    manifestTransforms: [(entries) => {
      const manifest = entries.map((entry) => {
        if (entry.url.length > 1 && entry.url[0] !== '/')
          entry.url = `/${entry.url}`

        return entry
      })

      return { manifest, warnings: [] }
    }],
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    type: 'module',
  },
}
