import { fileURLToPath } from 'node:url'
import Inspect from 'vite-plugin-inspect'
import { isCI } from 'std-env'
import { i18n } from './config/i18n'

const isPreview = process.env.PULL_REQUEST === 'true'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/i18n',
    '~/modules/purge-comments',
    '~/modules/setup-components',
  ],
  experimental: {
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
    querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
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
    public: {
      env: isCI ? isPreview ? 'staging' : 'production' : 'local',
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
  nitro: {
    publicAssets: [
      ...(!isCI || isPreview ? [{ dir: fileURLToPath(new URL('./public-dev', import.meta.url)) }] : []),
    ],
    prerender: {
      crawlLinks: false,
      routes: ['/', '/200.html'],
    },
    routeRules: {
      '/api/og-image/**': {
        static: true,
        cache: {
          maxAge: 86400, // 1 day
        },
      },
    },
  },
  app: {
    keepalive: true,
    head: {
      // Prevent arbitrary zooming on mobile devices
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
      ],
    },
  },
  i18n,
})

declare global {
  namespace NodeJS {
    interface Process {
      mock?: Record<string, any>
    }
  }
}
