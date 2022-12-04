import Inspect from 'vite-plugin-inspect'
import { isCI, isDevelopment } from 'std-env'
import { i18n } from './modules/i18n-configuration'
import { pwa } from './modules/pwa-configuration'

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
    '~/modules/pwa/index', // change to '@vite-pwa/nuxt' once released and remove pwa module
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
      'process.mock': ((isDevelopment || (isCI && process.env.PULL_REQUEST === 'true')) && process.env.MOCK_USER) || 'false',
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
    env: isCI ? 'deployed' : 'local',
    deployUrl: !isCI
      ? 'http://localhost:5314'
      : process.env.PULL_REQUEST === 'true'
        ? process.env.DEPLOY_PRIME_URL
        : 'https://elk.zone',
    cloudflare: {
      accountId: '',
      namespaceId: '',
      apiToken: '',
    },
    public: {
      translateApi: '',
      // Masto uses Mastodon version checks to see what features are enabled.
      // Mastodon alternatives like GoToSocial will always fail these checks, so
      // provide a way to disable them.
      disableVersionCheck: false,
    },
    storage: {
      driver: 'cloudflare',
      fsBase: 'node_modules/.cache/servers',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', '/200.html'],
    },
  },
  app: {
    keepalive: true,
    head: {
      // Prevent arbitrary zooming on mobile devices
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
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
