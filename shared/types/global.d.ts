import 'masto'

declare module 'masto/mastodon/entities/v1/index.js' {
  // fedibird non-mastodon emoji reaction
  interface FedibirdEmojiReaction {
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
    emojiReactions?: FedibirdEmojiReaction[]
  }

  // TODO: not implemented yet (only type definition)
  // Akkoma/Pleroma emoji reactions
  // ref. Differences in Mastodon API responses from vanilla Mastodon - Akkoma Documentation
  // - https://docs.akkoma.dev/stable/development/API/differences_in_mastoapi_responses/
  interface AkkomaEmojiReaction {
    name: string
    count: number
    me: boolean
    account_ids: string[]
    url?: string
  }

  interface Status {
    pleroma?: {
      akkomaEmojiReactions?: AkkomaEmojiReaction[]
    }
  }
}
