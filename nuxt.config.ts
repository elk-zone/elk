import Inspect from 'vite-plugin-inspect'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
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
    deployUrl: process.env.PULL_REQUEST === 'true' ? process.env.DEPLOY_PRIME_URL : '',
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
      routes: ['/200.html'],
    },
  },
})
