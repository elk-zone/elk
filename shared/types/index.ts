import type { mastodon } from 'masto'
import type { RouteLocationRaw } from 'vue-router'
import type { MarkNonNullable, Mutable } from './utils'

export interface AppInfo {
  id: string
  name: string
  website: string | null
  redirect_uri: string
  client_id: string
  client_secret: string
  vapid_key: string
}

export interface UserLogin {
  server: string
  token?: string
  account: mastodon.v1.AccountCredentials
  vapidKey?: string
  pushSubscription?: mastodon.v1.WebPushSubscription
}

export type PaginatorState = 'idle' | 'loading' | 'done' | 'error'

export interface GroupedNotifications {
  id: string
  type: 'grouped-follow'
  items: mastodon.v1.Notification[]
}

export interface GroupedAccountLike {
  account: mastodon.v1.Account
  favourite?: mastodon.v1.Notification
  reblog?: mastodon.v1.Notification
}

export interface GroupedLikeNotifications {
  id: string
  type: 'grouped-reblogs-and-favourites'
  status: mastodon.v1.Status
  likes: GroupedAccountLike[]
}

export type NotificationSlot = GroupedNotifications | GroupedLikeNotifications | mastodon.v1.Notification

export interface DraftItem {
  editingStatus?: mastodon.v1.Status
  initialText?: string
  params: MarkNonNullable<Mutable<Omit<mastodon.rest.v1.CreateScheduledStatusParams, 'poll'>>, 'status' | 'language' | 'sensitive' | 'spoilerText' | 'visibility'> & { poll: Mutable<mastodon.rest.v1.CreateScheduledStatusParams['poll']> }
  attachments: mastodon.v1.MediaAttachment[]
  lastUpdated: number
  mentions?: string[]
  quotedStatusId?: mastodon.v1.Status['id']
}

export type DraftKey = 'home' | 'dialog' | 'intent' | 'quote' | `reply-${string}` | `edit-${string}`

export type DraftMap = Record<DraftKey, DraftItem[]
  // For backward compatibility to support single draft item before introducing thread
  | DraftItem>

export interface ConfirmDialogOptions {
  title: string
  description?: string
  confirm?: string
  cancel?: string
  extraOptionType?: 'mute' | 'block_domain'
  domainToBlock?: string
}
export interface ConfirmDialogChoice {
  choice: 'confirm' | 'cancel'
  extraOptions?: {
    mute?: {
      duration: number
      notifications: boolean
    }
    block_domain?: {
      confirmed: boolean
    }
  }
}

export interface CommonRouteTabOption {
  to: RouteLocationRaw
  display: string
  disabled?: boolean
  name?: string
  icon?: string
  hide?: boolean
  match?: boolean
}
export interface CommonRouteTabMoreOption {
  options: CommonRouteTabOption[]
  icon?: string
  tooltip?: string
  match?: boolean
}

export interface ErrorDialogData {
  title: string
  messages: string[]
  close: string
}

export interface BuildInfo {
  version: string
  commit: string
  shortCommit: string
  time: number
  branch: string
  env: 'preview' | 'canary' | 'dev' | 'release'
}
