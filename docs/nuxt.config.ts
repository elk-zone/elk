// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['docus'],

  css: ['~/assets/css/main.css'],

  site: {
    name: 'Elk',
    url: 'https://docs.elk.zone',
  },

  llms: {
    domain: 'https://docs.elk.zone',
  },

  vite: {
    optimizeDeps: {
      include: ['scule'],
    },
  },

  compatibilityDate: '2024-11-07',
})
