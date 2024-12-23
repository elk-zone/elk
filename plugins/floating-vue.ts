import { defineNuxtPlugin } from '#imports'
import FloatingVue from 'floating-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue)
})
