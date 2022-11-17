import { login } from 'masto'

export default defineNuxtPlugin((nuxt) => {
  const { server, token } = useAppCookies()

  const masto = login({
    url: `https://${server.value}`,
    accessToken: token.value || undefined,
  })

  nuxt.$masto = masto
})
