import type { RouteLocationRaw } from '#vue-router'
import type { akkoma } from 'akko'
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
  account: akkoma.v1.AccountCredentials
  vapidKey?: string
  pushSubscription?: akkoma.v1.WebPushSubscription
}

export type PaginatorState = 'idle' | 'loading' | 'done' | 'error'

export interface GroupedNotifications {
  id: string
  type: 'grouped-follow'
  items: akkoma.v1.Notification[]
}

export interface GroupedAccountLike {
  account: akkoma.v1.Account
  reaction?: akkoma.v1.Notification | akkoma.v1.ReactionNotification
  reblog?: akkoma.v1.Notification
}

export interface GroupedLikeNotifications {
  id: string
  type: 'grouped-reblogs-and-favourites'
  status: akkoma.v1.Status
  likes: GroupedAccountLike[]
}

export type NotificationSlot = GroupedNotifications | GroupedLikeNotifications | akkoma.v1.Notification

export type TranslateFn = ReturnType<typeof useI18n>['t']

export interface DraftItem {
  editingStatus?: akkoma.v1.Status
  initialText?: string
  params: MarkNonNullable<Mutable<Omit<akkoma.rest.v1.CreateStatusParams, 'poll'>>, 'status' | 'language' | 'sensitive' | 'spoilerText' | 'visibility'> & { poll: Mutable<akkoma.rest.v1.CreateStatusParams['poll']> }
  attachments: akkoma.v1.MediaAttachment[]
  lastUpdated: number
  mentions?: string[]
}

export type DraftMap = Record<string, Array<DraftItem>
 // For backward compatibility we need to support single draft items
  | DraftItem>

export interface ConfirmDialogOptions {
  title: string
  description?: string
  confirm?: string
  cancel?: string
  extraOptionType?: 'mute'
}
export interface ConfirmDialogChoice {
  choice: 'confirm' | 'cancel'
  extraOptions?: {
    mute: {
      duration: number
      notifications: boolean
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
