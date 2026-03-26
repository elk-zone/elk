import type { mastodon } from 'masto'

export const UserLinkRE = /^(?:https:\/)?\/([^/]+)\/@([^/]+)$/
export const TagLinkRE = /^https?:\/\/([^/]+)\/tags\/([^/]+)\/?$/
export const HTMLTagRE = /<[^>]+>/g

export function getDataUrlFromArr(arr: Uint8ClampedArray, w: number, h: number) {
  if (typeof w === 'undefined' || typeof h === 'undefined')
    w = h = Math.sqrt(arr.length / 4)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = w
  canvas.height = h

  const imgData = ctx.createImageData(w, h)
  imgData.data.set(arr)
  ctx.putImageData(imgData, 0, 0)

  return canvas.toDataURL()
}

export function emojisArrayToObject(emojis: mastodon.v1.CustomEmoji[]) {
  return Object.fromEntries(emojis.map(i => [i.shortcode, i]))
}

export function noop() {}

export function useIsMac() {
  const headers = useRequestHeaders(['user-agent'])
  return computed(() => headers['user-agent']?.includes('Macintosh')
    ?? navigator?.userAgent?.includes('Mac') ?? false)
}

export function isEmptyObject(object: object) {
  return Object.keys(object).length === 0
}

export function removeHTMLTags(str: string) {
  return str.replaceAll(HTMLTagRE, '')
}
