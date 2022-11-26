import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = () => {
    // TODO: client.ts module has a top level await, and so the app will not work
    // TODO: once client.ts module fixed we can remove this
    // console.error(err, vm, info)
  }
})
