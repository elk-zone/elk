import opengraph from 'opengraph-io'

// This API-Endpoint will be cached via nuxt.config.ts -> nitro.routeRules['/api/og-image'].cache.maxAge = 86400

let openGraphClient: any = null

function getOpenGraphClient(): any {
  if (openGraphClient == null)
    openGraphClient = opengraph({ appId: process.env.NUXT_OPENGRAPH_API, fullRender: true })

  return openGraphClient
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

  const response = await getOpenGraphClient().getSiteInfo(cardUrl)

  const ogImageUrl = response?.openGraph?.image?.url ?? ''

  console.log(JSON.stringify({ cardUrl, ogImageUrl }))

  await send(event, ogImageUrl)
})

