import type { AccountCredentials, Emoji, Filter, Instance, Notification } from 'masto'

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
  account: AccountCredentials
  server: string
  filters?: Filter[]
  token?: string
}

export type PaginatorState = 'idle' | 'loading' | 'done' | 'error'

export interface ServerInfo extends Instance {
  server: string
  timeUpdated: number
  customEmojis?: Record<string, Emoji>
}

export interface GroupedNotifications {
  id: string
  type: string
  items: Notification[]
}

export type TranslateFn = ReturnType<typeof useI18n>['t']
