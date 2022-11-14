import { login } from 'masto'

export const DEFAULT_SERVER = 'https://mas.to'

export default defineNuxtPlugin((nuxt) => {
  const server = useCookie('nuxtodon-server')
  const token = useCookie('nuxtodon-token')
  const masto = login({
    url: server.value || DEFAULT_SERVER,
    accessToken: token.value,
  })
  nuxt.vueApp.provide('masto', masto)
})
