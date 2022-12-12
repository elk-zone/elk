// This API-Endpoint will be cached via netlify builder function -> nitro.routeRules['/api/og-image/**']

export default defineEventHandler(async (event) => {
  const { url } = getRouterParams(event)

  const cardUrl = decodeURIComponent(url || '')

  if (!cardUrl) {
    sendError(event, {
      statusCode: 422,
      fatal: false,
      message: 'Missing cardUrl.',
      name: 'OgImageError',
      unhandled: false,
    })
    return
  }

  // First we want to try to get the og:image from the html
  // But sometimes it is not included due to async JS loading
  const ogImageUrl = await resolveOgImageUrlManually(cardUrl)

  if (!ogImageUrl) {
    // If nothing helped, send 404 so the srcset can fallback to the default image
    sendError(event, {
      statusCode: 404,
      fatal: false,
      message: 'Could not find og:image.',
      name: 'OgImageError',
      unhandled: false,
    })
    return
  }

  return $fetch(ogImageUrl, {
    responseType: 'stream',
  })
})

const OG_IMAGE_RE = /<meta[^>]*property="og:image"[^>]*content="([^"]+)"|<meta[^>]*content="([^"]+)"[^>]*property="og:image"/

async function resolveOgImageUrlManually(cardUrl: string): Promise<string> {
  const html = await $fetch<string>(cardUrl)

  const match = html.match(OG_IMAGE_RE)
  return match?.[1] ?? match?.[2] ?? ''
}
