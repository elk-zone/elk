// masto types and notification types differs
// Any type used from masto api retrieving notification from push notification id is no camel case, it is snake case
// I just copy/paste any entry from masto api and convert it to snake case, reusing types not including camel case props
import type { mastodon } from 'masto'

export type NotificationType = 'mention' | 'status' | 'reblog' | 'follow' | 'follow_request' | 'favourite' | 'poll' | 'update' | 'admin.sign_up' | 'admin.report'

export interface PushPayload {
  access_token: string
  notification_id: string
  notification_type: NotificationType
  preferred_locale: string
  title: string
  body: string
  icon: string
}

export interface UserLogin {
  server: string
  token?: string
  account: mastodon.v1.AccountCredentials
}

export interface NotificationInfo {
  user: UserLogin
  notification: MastoNotification
}

interface PollOption {
  /** The text value of the poll option. String. */
  title: string
  /** The number of received votes for this option. Number, or null if results are not published yet. */
  votes_count?: number
  /** Custom emoji to be used for rendering poll options. */
  emojis: Emoji[]
}
/**
 * Represents a poll attached to a status.
 * @see https://docs.joinmastodon.org/entities/poll/
 */
interface Poll {
  /** The ID of the poll in the database. */
  id: string
  /** When the poll ends. */
  expires_at?: string | null
  /** Is the poll currently expired? */
  expired: boolean
  /** Does the poll allow multiple-choice answers? */
  multiple: boolean
  /** How many votes have been received. */
  votes_count: number
  /** How many unique accounts have voted on a multiple-choice poll. */
  voters_count?: number | null
  /** When called with a user token, has the authorized user voted? */
  voted?: boolean
  /**
   * When called with a user token, which options has the authorized user chosen?
   * Contains an array of index values for options.
   */
  own_votes?: number[] | null
  /** Possible answers for the poll. */
  options: PollOption[]
}

export interface Attachment {
  /** The ID of the attachment in the database. */
  id: string
  /** The type of the attachment. */
  type: mastodon.v1.MediaAttachmentType
  /** The location of the original full-size attachment. */
  url?: string | null
  /** The location of a scaled-down preview of the attachment. */
  preview_url: string
  /** The location of the full-size original attachment on the remote website. */
  remote_url?: string | null
  /** Remote version of previewUrl */
  preview_remote_url?: string | null
  /** A shorter URL for the attachment. */
  text_url?: string | null
  /** Metadata returned by Paperclip. */
  meta?: mastodon.v1.MediaAttachmentMeta | null
  /**
   * Alternate text that describes what is in the media attachment,
   * to be used for the visually impaired or when media attachments do not load.
   */
  description?: string | null
  /**
   * A hash computed by the BlurHash algorithm,
   * for generating colorful preview thumbnails when media has not been downloaded yet.
   */
  blurhash?: string | null
}

export interface Emoji {
  /** The name of the custom emoji. */
  shortcode: string
  /** A link to the custom emoji. */
  url: string
  /** A link to a static copy of the custom emoji. */
  static_url: string
  /** Whether this Emoji should be visible in the picker or unlisted. */
  visible_in_picker: boolean
  /** Used for sorting custom emoji in the picker. */
  category?: string | null
}

export interface Status {
  /** ID of the status in the database. */
  id: string
  /** URI of the status used for federation. */
  uri: string
  /** The date when this status was created. */
  created_at: string
  /** Timestamp of when the status was last edited. */
  edited_at: string | null
  /** The account that authored this status. */
  account: MastoAccount
  /** HTML-encoded status content. */
  content: string
  /** Visibility of this status. */
  visibility: mastodon.v1.StatusVisibility
  /** Is this status marked as sensitive content? */
  sensitive: boolean
  /** Subject or summary line, below which status content is collapsed until expanded. */
  spoiler_text: string
  /** Media that is attached to this status. */
  media_attachments: Attachment[]
  /** The application used to post this status. */
  // application: Application
  /** Mentions of users within the status content. */
  mentions: mastodon.v1.StatusMention[]
  /** Hashtags used within the status content. */
  tags: mastodon.v1.Tag[]
  /** Custom emoji to be used when rendering status content. */
  emojis: Emoji[]
  /** How many boosts this status has received. */
  reblogs_count: number
  /** How many favourites this status has received. */
  favourites_count: number
  /** How many replies this status has received. */
  replies_count: number
  /** A link to the status's HTML representation. */
  url?: string | null
  /** ID of the status being replied. */
  in_reply_to_id?: string | null
  /** ID of the account being replied to. */
  in_reply_to_account_id?: string | null
  /** The status being reblogged. */
  reblog?: Status | null
  /** The poll attached to the status. */
  poll?: Poll | null
  /** Preview card for links included within status content. */
  card?: mastodon.v1.PreviewCard | null
  /** Primary language of this status. */
  language?: string | null
  /**
   * Plain-text source of a status. Returned instead of `content` when status is deleted,
   * so the user may redraft from the source text without the client having
   * to reverse-engineer the original text from the HTML content.
   */
  text?: string | null
  /** Have you favourited this status? */
  favourited?: boolean | null
  /** Have you boosted this status? */
  reblogged?: boolean | null
  /** Have you muted notifications for this status's conversation? */
  muted?: boolean | null
  /** Have you bookmarked this status? */
  bookmarked?: boolean | null
  /** Have you pinned this status? Only appears if the status is pin-able. */
  pinned?: boolean | null
}

export interface Field {
  /** The key of a given field's key-value pair. */
  name: string
  /** The value associated with the `name` key. */
  value: string
  /** Timestamp of when the server verified a URL value for a rel="me” link. */
  verified_at?: string | null
}
export interface MastoAccount {
  /** The account id */
  id: string
  /** The username of the account, not including domain */
  username: string
  /** The WebFinger account URI. Equal to `username` for local users, or `username@domain` for remote users. */
  acct: string
  /** The location of the user's profile page. */
  url: string
  /** The profile's display name. */
  display_name: string
  /** The profile's bio / description. */
  note: string
  /** An image icon that is shown next to statuses and in the profile. */
  avatar: string
  /** A static version of the `avatar`. Equal to avatar if its value is a static image; different if `avatar` is an animated GIF. */
  avatar_static: string
  /** An image banner that is shown above the profile and in profile cards. */
  header: string
  /** A static version of the header. Equal to `header` if its value is a static image; different if `header` is an animated GIF. */
  header_static: string
  /** Whether the account manually approves follow requests. */
  locked: boolean
  /** Custom emoji entities to be used when rendering the profile. If none, an empty array will be returned. */
  emojis: Emoji[]
  /** Whether the account has opted into discovery features such as the profile directory. */
  discoverable: boolean
  /** When the account was created. */
  created_at: string
  /** How many statuses are attached to this account. */
  statuses_count: number
  /** The reported followers of this profile. */
  followers_count: number
  /** The reported follows of this profile. */
  following_count: number
  /** Time of the last status posted */
  last_status_at: string
  /** Indicates that the profile is currently inactive and that its user has moved to a new account. */
  moved?: boolean | null
  /** An extra entity returned when an account is suspended. */
  suspended?: boolean | null
  /** Additional metadata attached to a profile as name-value pairs. */
  fields?: Field[] | null
  /** Boolean to indicate that the account performs automated actions */
  bot?: boolean | null
}

export interface MastoNotification {
  /** The id of the notification in the database. */
  id: string
  /** The type of event that resulted in the notification. */
  type: NotificationType
  /** The timestamp of the notification. */
  created_at: string
  /** The account that performed the action that generated the notification. */
  account: MastoAccount
  /** Status that was the object of the notification, e.g. in mentions, reblogs, favourites, or polls. */
  status?: Status | null
}
