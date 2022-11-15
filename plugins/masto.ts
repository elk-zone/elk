import { login } from 'masto'

export default defineNuxtPlugin((nuxt) => {
  const { server, token } = useAppCookies()

  const masto = login({
    url: `https://${server.value}`,
    accessToken: token.value,
  })
  nuxt.vueApp.provide('masto', masto)
})
