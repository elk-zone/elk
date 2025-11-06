export default defineNuxtPlugin({
  order: -40,
  setup: (nuxtApp) => {
    delete nuxtApp.payload.path
  },
})
