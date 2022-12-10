import type { AccountCredentials, Emoji, Instance, Notification } from 'masto'

export interface AppInfo {
  id: string
  name: string
  website: string | null
  redirect_uri: string
  client_id: string
  client_secret: string
  vapid_key: string
}

export interface ElkAccountCredentials extends AccountCredentials {
  displayServerName: string
}

export interface UserLogin {
  server: string
  token?: string
  account: AccountCredentials
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
