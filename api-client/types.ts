export interface Post {
  id: string
  created_at: Date
  in_reply_to_id: null | string
  in_reply_to_account_id: null | string
  sensitive: boolean
  spoiler_text: string
  visibility: Visibility
  language: string
  uri: string
  url: string
  replies_count: number
  reblogs_count: number
  favourites_count: number
  edited_at: null
  favourited: boolean
  reblogged: boolean
  muted: boolean
  bookmarked: boolean
  content: string
  filtered: any[]
  reblog: null
  account: Account
  media_attachments: MediaAttachment[]
  mentions: any[]
  tags: Tag[]
  emojis: Emoji[]
  card: null
  poll: null
  application?: Application
}

export interface Account {
  id: string
  username: string
  acct: string
  display_name: string
  locked: boolean
  bot: boolean
  discoverable: boolean
  group: boolean
  created_at: Date
  note: string
  url: string
  avatar: string
  avatar_static: string
  header: string
  header_static: string
  followers_count: number
  following_count: number
  statuses_count: number
  last_status_at: Date
  emojis: Emoji[]
  fields: Field[]
  noindex?: boolean
}

export interface Emoji {
  shortcode: string
  url: string
  static_url: string
  visible_in_picker: boolean
}

export interface Field {
  name: string
  value: string
  verified_at: Date | null
}

export interface Application {
  name: string
  website: null | string
}

export interface MediaAttachment {
  id: string
  type: string
  url: string
  preview_url: string
  remote_url: string
  preview_remote_url: null
  text_url: null
  meta: Meta
  description: null | string
  blurhash: string
}

export interface Meta {
  focus?: Focus
  original: Original
  small: Original
}

export interface Focus {
  x: number
  y: number
}

export interface Original {
  width: number
  height: number
  size: string
  aspect: number
}

export interface Tag {
  name: string
  url: string
}

export enum Visibility {
  Public = 'public',
}
