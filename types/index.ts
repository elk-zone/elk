import type { mastodon } from 'masto'
import type { Ref } from 'vue'
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

export interface ElkMasto extends mastodon.Client {
  loginTo (user?: Omit<UserLogin, 'account'> & { account?: mastodon.v1.AccountCredentials }): Promise<mastodon.Client>
  loggedIn: Ref<boolean>
}

export type PaginatorState = 'idle' | 'loading' | 'done' | 'error'

export interface ServerInfo extends mastodon.v2.Instance {
  server: string
  timeUpdated: number
  customEmojis?: Record<string, mastodon.v1.CustomEmoji>
}

export interface GroupedNotifications {
  id: string
  type: Exclude<string, 'grouped-reblogs-and-favourites'>
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
  params: MarkNonNullable<Mutable<mastodon.v1.CreateStatusParams>, 'status' | 'language' | 'sensitive' | 'spoilerText' | 'visibility'>
  attachments: mastodon.v1.MediaAttachment[]
  lastUpdated: number
}
export type DraftMap = Record<string, Draft>

export interface ConfirmDialogLabel {
  title: string
  description?: string
  confirm?: string
  cancel?: string
}
export type ConfirmDialogChoice = 'confirm' | 'cancel'

export interface BuildInfo {
  version: string
  commit: string
  time: number
  branch: string
  env: 'preview' | 'canary' | 'dev' | 'release'
}

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ColorMode = 'light' | 'dark'
