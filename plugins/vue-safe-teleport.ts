import VueSafeTeleport from 'vue-safe-teleport'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSafeTeleport)
})
