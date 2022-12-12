import opengraph from 'opengraph-io'

// This API-Endpoint will be cached via nuxt.config.ts -> nitro.routeRules['/api/og-image'].cache.maxAge = 86400

type OpenGraphClient = ReturnType<typeof opengraph>

let openGraphClient: OpenGraphClient

function getOpenGraphClient(): OpenGraphClient {
  const NUXT_OPENGRAPH_API = process.env.NUXT_OPENGRAPH_API
  if (typeof NUXT_OPENGRAPH_API !== 'string')
    throw new Error('Missing NUXT_OPENGRAPH_API environment variable.')

  if (!openGraphClient)
    openGraphClient = opengraph({ appId: NUXT_OPENGRAPH_API, fullRender: true })!

  return openGraphClient
}

function extractOgImageUrl(html: string): string {
  const match = html.match(/<meta property="og:image" content="([^"]+)" \/>/)
  return match?.[1] ?? ''
}

export default defineEventHandler(async (event) => {
  const { cardUrl } = getQuery(event)

  if (!cardUrl) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Missing cardUrl.',
    })
  }

  if (typeof cardUrl !== 'string') {
    throw createError({
      statusCode: 422,
      statusMessage: 'cardUrl must be string.',
    })
  }

  let ogImageUrl = ''

  try {
    // First we want to try to get the og:image from the html
    // But sometimes it is not included due to async JS loading
    const html = await $fetch<string>(cardUrl)
    ogImageUrl = extractOgImageUrl(html)

    if (process.env.NUXT_OPENGRAPH_API) {
    // If no og:image was found, try to get it from opengraph.io
      if (!ogImageUrl) {
        const response = await getOpenGraphClient().getSiteInfo(cardUrl)

        ogImageUrl = response?.openGraph?.image?.url || response?.hybridGraph?.image || ''
      }
    }

    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ cardUrl, ogImageUrl }))

    await send(event, ogImageUrl)
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: (error as Error)?.message || 'Unknown error.',
      cause: error,
    })
  }
})

