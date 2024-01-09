import type { mastodon } from 'masto'
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

export type TranslateFn = ReturnType<typeof useI18n>['t']

export interface Draft {
  editingStatus?: mastodon.v1.Status
  initialText?: string
  params: MarkNonNullable<Mutable<Omit<mastodon.rest.v1.CreateStatusParams, 'poll'>>, 'status' | 'language' | 'sensitive' | 'spoilerText' | 'visibility'> & { poll: Mutable<mastodon.rest.v1.CreateStatusParams['poll']> }
  attachments: mastodon.v1.MediaAttachment[]
  lastUpdated: number
  mentions?: string[]
}

export type DraftMap = Record<string, Draft>

export interface ConfirmDialogLabel {
  title: string
  description?: string
  confirm?: string
  cancel?: string
}
export type ConfirmDialogChoice = 'confirm' | 'cancel'

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
