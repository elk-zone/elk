import { GesturePlugin } from '@vueuse/gesture'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(GesturePlugin)
})
