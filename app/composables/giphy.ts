export interface GiphyGif {
  id: string
  title: string
  // preview = lower-res for grid; original = what we attach
  preview: { url: string, width: number, height: number }
  original: { url: string, width: number, height: number, size: number }
}

interface RawGifImage {
  url: string
  width: string
  height: string
  size?: string
}

interface RawGif {
  id: string
  title: string
  images: {
    fixed_width: RawGifImage
    original: RawGifImage
  }
}

function normalize(raw: RawGif): GiphyGif {
  return {
    id: raw.id,
    title: raw.title,
    preview: {
      url: raw.images.fixed_width.url,
      width: Number(raw.images.fixed_width.width),
      height: Number(raw.images.fixed_width.height),
    },
    original: {
      url: raw.images.original.url,
      width: Number(raw.images.original.width),
      height: Number(raw.images.original.height),
      size: Number(raw.images.original.size ?? 0),
    },
  }
}

export function useGiphy() {
  const apiKey = useRuntimeConfig().public.giphyApiKey

  async function call(endpoint: 'search' | 'trending', params: Record<string, string>) {
    if (!apiKey)
      throw new Error('GIPHY API key is not configured')

    const url = new URL(`https://api.giphy.com/v1/gifs/${endpoint}`)
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('limit', '24')
    url.searchParams.set('rating', 'pg-13')
    for (const [k, v] of Object.entries(params))
      url.searchParams.set(k, v)

    const res = await fetch(url)
    if (!res.ok)
      throw new Error(`GIPHY ${endpoint} failed: ${res.status}`)
    const json = await res.json() as { data: RawGif[] }
    return json.data.map(normalize)
  }

  function trending() {
    return call('trending', {})
  }

  function search(query: string) {
    return call('search', { q: query })
  }

  async function downloadAsFile(gif: GiphyGif): Promise<File> {
    const res = await fetch(gif.original.url)
    if (!res.ok)
      throw new Error(`GIPHY GIF download failed: ${res.status}`)
    const blob = await res.blob()
    const filename = `giphy-${gif.id}.gif`
    return new File([blob], filename, { type: blob.type || 'image/gif' })
  }

  return { trending, search, downloadAsFile, hasKey: !!apiKey }
}
