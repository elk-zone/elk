// This API-Endpoint will be cached via nuxt.config.ts -> nitro.routeRules['/api/og-image'].cache.maxAge = 86400

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

  const html = await $fetch<string>(cardUrl)
  const ogImageUrl = extractOgImageUrl(html)

  await send(event, ogImageUrl)
})

