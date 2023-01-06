import type { Account, AccountCredentials, Attachment, CreateStatusParams, Emoji, Instance, MastoClient, Notification, PushSubscription, Status } from 'masto'
import type { Ref } from 'vue'
import type { MarkNonNullable, Mutable } from './utils'
import type { LoginTo } from '~/composables/users'

export interface AppInfo {
  id: string
  name: string
  website: string | null
  redirect_uri: string
  client_id: string
  client_secret: string
  vapid_key: string
}

interface UserLoginWithToken {
  account: AccountCredentials
  guest: false
}

interface UserLoginGuest {
  account?: undefined
  guest: true
}

export type UserLogin<WithToken extends boolean = boolean> = {
  server: string
  token?: string
  vapidKey?: string
  pushSubscription?: PushSubscription
} & ((WithToken extends false ? UserLoginGuest : never) | (WithToken extends true ? UserLoginWithToken : never))

export interface ElkMasto extends MastoClient {
  loginTo: LoginTo
  loggedIn: Ref<boolean>
}

export type PaginatorState = 'idle' | 'loading' | 'done' | 'error'

export interface ServerInfo extends Instance {
  server: string
  timeUpdated: number
  customEmojis?: Record<string, Emoji>
}

export interface GroupedNotifications {
  id: string
  type: Exclude<string, 'grouped-reblogs-and-favourites'>
  items: Notification[]
}

export interface GroupedAccountLike {
  account: Account
  favourite?: Notification
  reblog?: Notification
}

export interface GroupedLikeNotifications {
  id: string
  type: 'grouped-reblogs-and-favourites'
  status: Status
  likes: GroupedAccountLike[]
}

export type NotificationSlot = GroupedNotifications | GroupedLikeNotifications | Notification

export type TranslateFn = ReturnType<typeof useI18n>['t']

export interface Draft {
  editingStatus?: Status
  initialText?: string
  params: MarkNonNullable<Mutable<CreateStatusParams>, 'status' | 'language' | 'sensitive' | 'spoilerText' | 'visibility'>
  attachments: Attachment[]
  lastUpdated: number
}
export type DraftMap = Record<string, Draft>

export interface BuildInfo {
  version: string
  commit: string
  time: number
  branch: string
  env: 'preview' | 'canary' | 'dev' | 'release'
}

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ColorMode = 'light' | 'dark'
