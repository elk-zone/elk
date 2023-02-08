import virtual from 'vite-plugin-virtual/dist'

export default defineNuxtConfig({
  app: {
    baseURL: '/docs',
  },
  extends: '@nuxt-themes/docus',
  vite: {
    plugins: [
      virtual({
        'virtual:elk-locales': {
          en: {
            translated: [
              'a11y.mykey',
            ],
            missing: [
              'a11y.myOtherKey',
            ],
            outdated: [
              'a11y.notExistFromSource',
            ],
            total: 2,
          },
        },
      }),
    ],
  },
})
