import type { EmojiRegexMatch } from '@iconify/utils/lib/emoji/replace/find'
// @unimport-disabled
import { emojiFilename, emojiPrefix, emojiRegEx } from '@iconify-emoji/twemoji'
import { getEmojiMatchesInText } from '@iconify/utils/lib/emoji/replace/find'

// Re-export everything from package
export * from '@iconify-emoji/twemoji'

// Package name
export const iconifyEmojiPackage = '@iconify-emoji/twemoji'

export function getEmojiAttributes(input: EmojiRegexMatch | string) {
  const match = typeof input === 'string'
    ? getEmojiMatchesInText(emojiRegEx, input)?.[0]
    : input
  const file = emojiFilename(match)
  const className = `iconify-emoji iconify-emoji--${emojiPrefix}${file.padding ? ' iconify-emoji-padded' : ''}`
  return {
    class: className,
    src: `/emojis/${emojiPrefix}/${file.filename}`,
    alt: match.match,
  }
}
