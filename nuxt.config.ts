import { fileURLToPath } from 'node:url'
import Inspect from 'vite-plugin-inspect'
import { isCI, isDevelopment } from 'std-env'
import { i18n } from './config/i18n'
import { pwa } from './config/pwa'

const isPreview = process.env.PULL_REQUEST === 'true' || process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'dev'

export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      exclude: ['../service-worker'],
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/i18n',
    '~/modules/purge-comments',
    '~/modules/setup-components',
    '~/modules/pwa/index', // change to '@vite-pwa/nuxt' once released and remove pwa module
    '~/modules/tauri/index',
  ],
  experimental: {
    payloadExtraction: false,
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/tiptap.css',
    '~/styles/dropdown.css',
  ],
  alias: {
    'querystring': 'rollup-plugin-node-polyfills/polyfills/qs',
    'masto/fetch': 'masto/fetch',
    'masto': 'masto/fetch',
  },
  vite: {
    define: {
      'import.meta.env.__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
      'import.meta.env.__BUILD_COMMIT__': JSON.stringify(process.env.COMMIT_REF || ''),
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
    },
    build: {
      target: 'esnext',
    },
    plugins: [
      Inspect(),
    ],
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  runtimeConfig: {
    deployUrl: !isCI
      ? 'http://localhost:5314'
      : isPreview
        ? process.env.DEPLOY_PRIME_URL
        : 'https://elk.zone',
    cloudflare: {
      accountId: '',
      namespaceId: '',
      apiToken: '',
    },
    discord: {
      inviteUrl: 'https://chat.elk.zone',
    },
    github: {
      // oauth flow
      clientId: '',
      clientSecret: '',
      inviteToken: '',
    },
    public: {
      env: isCI ? isPreview ? 'staging' : 'production' : 'local',
      pwaEnabled: !isDevelopment || process.env.VITE_DEV_PWA === 'true',
      translateApi: '',
      // Masto uses Mastodon version checks to see what features are enabled.
      // Mastodon alternatives like GoToSocial will always fail these checks, so
      // provide a way to disable them.
      disableVersionCheck: false,
    },
    storage: {
      driver: isCI ? 'cloudflare' : 'fs',
      fsBase: 'node_modules/.cache/servers',
    },
  },
  routeRules: {
    '/manifest.webmanifest': {
      headers: {
        'Content-Type': 'application/manifest+json',
      },
    },
  },
  nitro: {
    publicAssets: [
      ...(!isCI || isPreview ? [{ dir: fileURLToPath(new URL('./public-dev', import.meta.url)) }] : []),
    ],
    prerender: {
      crawlLinks: false,
      routes: ['/', '/200.html'],
    },
  },
  app: {
    keepalive: true,
    head: {
      // Prevent arbitrary zooming on mobile devices
      viewport: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  i18n,
  pwa,
})

declare global {
  namespace NodeJS {
    interface Process {
      mock?: Record<string, any>
    }
  }
}
