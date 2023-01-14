import { sendRedirect } from 'h3'

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()
  if (!route.params.server)
    return

  const req = nuxtApp.ssrContext!.event.node.req
  const userAgent = req.headers['user-agent']!
  if (!userAgent)
    return

  const isOpenGraphCrawler = /twitterbot|discordbot|facebookexternalhit|googlebot|msnbot|baidu|ahrefsbot|duckduckgo/i.test(userAgent)
  if (isOpenGraphCrawler)
    await sendRedirect(nuxtApp.ssrContext!.event, `https:/${route.path}`, 301)
})
