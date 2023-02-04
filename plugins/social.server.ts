import { sendRedirect } from 'h3'

const BOT_RE = /bot\b|index|spider|facebookexternalhit|crawl|wget|slurp|mediapartners-google/i

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()
  const singleInstanceServer = useAppConfig().singleInstanceServer
  if (!route.params.server && !singleInstanceServer)
    return

  const userAgent = useRequestHeaders()['user-agent']
  if (!userAgent)
    return

  const isOpenGraphCrawler = BOT_RE.test(userAgent)
  if (isOpenGraphCrawler) {
    // Redirect bots to the original instance to respect their social sharing settings
    await sendRedirect(nuxtApp.ssrContext!.event, `https:/${route.path}`, 301)
  }
})
