import type { Account, AccountCredentials, Attachment, CreateStatusParams, Emoji, Instance, MastoClient, Notification, PushSubscription, Status } from 'masto/fetch'
import type { Ref } from 'vue'
import type { Mutable } from './utils'

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
  account: AccountCredentials
  vapidKey?: string
  pushSubscription?: PushSubscription
}

export interface ElkMasto extends MastoClient {
  loginTo (user?: Omit<UserLogin, 'account'> & { account?: AccountCredentials }): Promise<MastoClient>
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
  params: Omit<Mutable<CreateStatusParams>, 'status'> & {
    status?: Exclude<CreateStatusParams['status'], null>
  }
  attachments: Attachment[]
}
export type DraftMap = Record<string, Draft>
