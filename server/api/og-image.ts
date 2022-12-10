const inMemoryCache = new Map<string, { url: string; lastUsed: number }>()

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

  if (inMemoryCache.has(cardUrl)) {
    const { url } = inMemoryCache.get(cardUrl)!
    await send(event, url)

    // Remove oldest entry if cache is too big
    if (inMemoryCache.size > 5000) {
      const oldestEntry = [...inMemoryCache.entries()].reduce(
        (acc, [key, { lastUsed }]) => (lastUsed < acc.lastUsed ? { key, lastUsed } : acc),
        { key: '', lastUsed: Infinity },
      )
      inMemoryCache.delete(oldestEntry.key)
    }

    return
  }

  const result = await $fetch<string>(cardUrl)
  let ogImageUrl: string | null | undefined = null

  const match = result.match(/<meta property="og:image" content="([^"]+)" \/>/)
  ogImageUrl = match?.[1] ?? ''

  inMemoryCache.set(cardUrl, { url: ogImageUrl, lastUsed: Date.now() })

  await send(event, ogImageUrl)
})
