import Inspect from 'vite-plugin-inspect'
import { isCI } from 'std-env'

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
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': isCI && process.env.PULL_REQUEST === 'true' && process.env.MOCK_USER,
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
  },
  i18n: {
    locales: [
      {
        code: 'en-US',
        file: 'en-US.json',
        name: 'English',
      },
      {
        code: 'de-DE',
        file: 'de-DE.json',
        name: 'Deutsch',
      },
      {
        code: 'zh-CN',
        file: 'zh-CN.json',
        name: '简体中文',
      },
    ].sort((a, b) => a.code.localeCompare(b.code)),
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    // TODO:
    // lazy: true,
    langDir: 'locales',
    defaultLocale: 'en-US',
  },
})

declare global {
  namespace NodeJS {
    interface Process {
      mock?: Record<string, any>
    }
  }
}
