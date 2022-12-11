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

    inMemoryCache.set(cardUrl, { url, lastUsed: Date.now() })

    // Remove some oldest entries if cache gets to big
    if (inMemoryCache.size > 5000) {
      // Remove 10% of the oldest entries
      const entries = Array.from(inMemoryCache.entries()).sort(
        (a, b) => a[1].lastUsed - b[1].lastUsed,
      )
      const entriesToRemove = Math.floor(entries.length * 0.1)

      for (let i = 0; i < entriesToRemove; i++)
        inMemoryCache.delete(entries[i][0])
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
