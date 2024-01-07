import { sendRedirect } from 'h3'

const BOT_RE = /bot\b|index|spider|facebookexternalhit|crawl|wget|slurp|mediapartners-google|whatsapp/i

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()

  let routePath
  if (!route.params['server']) {
    const server = nuxtApp.$config.public.defaultServer
    if (!server)
      return
    routePath = `/${server}${route.path}`
  }
  else {
    routePath = route.path
  }

  const userAgent = useRequestHeaders()['user-agent']
  if (!userAgent)
    return

  const isOpenGraphCrawler = BOT_RE.test(userAgent)
  if (isOpenGraphCrawler) {
    // Redirect bots to the original instance to respect their social sharing settings
    await sendRedirect(nuxtApp.ssrContext!.event, `https:/${routePath}`, 301)
  }
})
