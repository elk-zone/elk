import type { mastodon } from 'masto'
import type { CustomEmojisInfo } from './push-notifications/types'
import { STORAGE_KEY_CUSTOM_EMOJIS } from '~/constants'

const TTL = 1000 * 60 * 60 * 24 // 1 day

function getDefault(): CustomEmojisInfo {
  return {
    lastUpdate: 0,
    emojis: [],
  }
}

export const currentCustomEmojis = import.meta.server
  ? computed(getDefault)
  : useUserLocalStorage(STORAGE_KEY_CUSTOM_EMOJIS, getDefault)

export async function updateCustomEmojis() {
  if (Date.now() - currentCustomEmojis.value.lastUpdate < TTL)
    return

  const { client } = useMasto()
  const emojis = await client.value.v1.customEmojis.list()
  Object.assign(currentCustomEmojis.value, {
    lastUpdate: Date.now(),
    emojis,
  })
}

function transformEmojiData(emojis: mastodon.v1.CustomEmoji[]) {
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

export function useEmojisFallback(emojisGetter: () => mastodon.v1.CustomEmoji[] | undefined) {
  return computed(() => {
    const result: mastodon.v1.CustomEmoji[] = []
    const emojis = emojisGetter()
    if (emojis)
      result.push(...emojis)

    result.push(...currentCustomEmojis.value.emojis)

    return emojisArrayToObject(result)
  })
}
