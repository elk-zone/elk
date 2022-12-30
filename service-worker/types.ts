import type { AccountCredentials, Notification as MastoNotification } from 'masto'

export interface PushPayload {
  access_token: string
  notification_id: string
  notification_type: 'follow' | 'favourite' | 'reblog' | 'mention' | 'poll'
  preferred_locale: string
  title: string
  body: string
  icon: string
}

export interface UserLogin {
  server: string
  token?: string
  account: AccountCredentials
}

export interface NotificationInfo {
  user: UserLogin
  notification: MastoNotification
}
