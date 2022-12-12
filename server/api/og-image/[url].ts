import opengraph from 'opengraph-io'

// This API-Endpoint will be cached via nuxt.config.ts -> nitro.routeRules['/api/og-image/**']

type OpenGraphClient = ReturnType<typeof opengraph>

let openGraphClient: OpenGraphClient

function getOpenGraphClient(): OpenGraphClient {
  const appId = useRuntimeConfig().opengraphApi
  if (typeof appId !== 'string')
    throw new Error('Missing NUXT_OPENGRAPH_API environment variable.')

  if (!openGraphClient)
    openGraphClient = opengraph({ appId, fullRender: true })!

  return openGraphClient
}

function extractOgImageUrl(html: string): string {
  const match = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"|<meta[^>]*content="([^"]+)"[^>]*property="og:image"/)
  return match?.[1] ?? match?.[2] ?? ''
}

async function resolveOgImageUrlManually(cardUrl: string): Promise<string> {
  const html = await $fetch<string>(cardUrl)

  const ogImageUrl = extractOgImageUrl(html)

  if (!ogImageUrl) {
    // Throw an error so we can try to apply another fallback
    throw new Error('Could not find og:image in html.')
  }

  return ogImageUrl
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { url } = getRouterParams(event)
  const { fallbackUrl } = getQuery(event)

  const cardUrl = decodeURIComponent(url)

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

  // If anything goes wrong, fail gracefully
  try {
    // First we want to try to get the og:image from the html
    // But sometimes it is not included due to async JS loading
    let ogImageUrl = await resolveOgImageUrlManually(cardUrl).catch(() =>
      // Try another fallback
      '',
    )

    if (config.opengraphApi) {
      // If no og:image was found, try to get it from opengraph.io
      if (!ogImageUrl) {
        const response = await getOpenGraphClient().getSiteInfo(cardUrl).catch(() =>
          // Try another fallback
          null,
        )

        ogImageUrl = response?.openGraph?.image?.url || response?.hybridGraph?.image || ''
      }
    }

    if (!ogImageUrl) {
      // If nothing helped, set cardUrl as default
      ogImageUrl = decodeURIComponent(fallbackUrl as string)
    }

    await sendRedirect(event, ogImageUrl)
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: (error as Error)?.message || 'Unknown error.',
      cause: error,
    })
  }
})

