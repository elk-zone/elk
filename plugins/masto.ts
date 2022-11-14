import { login } from 'masto'

export default defineNuxtPlugin((nuxt) => {
  const masto = login({
    url: 'https://mas.to',
  })
  nuxt.vueApp.provide('masto', masto)
})
