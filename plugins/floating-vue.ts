import FloatingVue from 'floating-vue'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue)
})
