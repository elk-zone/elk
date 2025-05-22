import 'masto'

declare module 'masto/mastodon/entities/v1/index.js' {
  // support fedibird non-mastodon emoji reaction
  interface EmojiReaction {
    name: string
    count: number
    accountIds: string[]
    me: boolean
    url?: string
    staticUrl?: string
    domain?: string | null
    width?: number
    height?: number
  }

  interface Status {
    emojiReactionsCount?: number
    emojiReactions?: EmojiReaction[]
  }
}
