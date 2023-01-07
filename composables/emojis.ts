import type { Emoji } from 'masto'
import type { CustomEmojisInfo } from './push-notifications/types'
import { STORAGE_KEY_CUSTOM_EMOJIS } from '~/constants'

const TTL = 1000 * 60 * 60 * 24 // 1 day

function getDefault(): CustomEmojisInfo {
  return {
    lastUpdate: 0,
    emojis: [],
  }
}

export const currentCustomEmojis = process.server
  ? computed(getDefault)
  : useUserLocalStorage(STORAGE_KEY_CUSTOM_EMOJIS, getDefault)

export async function updateCustomEmojis() {
  if (Date.now() - currentCustomEmojis.value.lastUpdate < TTL)
    return

  const masto = useMasto()
  const emojis = await masto.customEmojis.fetchAll()
  Object.assign(currentCustomEmojis.value, {
    lastUpdate: Date.now(),
    emojis,
  })
}

function transformEmojiData(emojis: Emoji[]) {
  const result = []

  for (const emoji of emojis) {
    if (!emoji.visibleInPicker)
      continue
    result.push({
      id: emoji.shortcode,
      native: ':emoji.shortcode:',
      name: emoji.shortcode,
      skins: [{ src: emoji.url || emoji.staticUrl }],
    })
  }

  return result
}

export const customEmojisData = computed(() => currentCustomEmojis.value.emojis.length
  ? [{
      id: 'custom',
      name: `Custom emojis on ${currentServer.value}`,
      emojis: transformEmojiData(currentCustomEmojis.value.emojis),
    }]
  : undefined)

export function useEmojisFallback(emojisGetter: () => Emoji[] | undefined) {
  return computed(() => {
    const result: Emoji[] = []
    const emojis = emojisGetter()
    if (emojis)
      result.push(...emojis)

    result.push(...currentCustomEmojis.value.emojis)

    return emojisArrayToObject(result)
  })
}
