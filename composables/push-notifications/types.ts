import type { mastodon } from 'masto'

import type { UserLogin } from '~/types'

export type SubscriptionResult = 'subscribed' | 'notification-denied' | 'not-supported' | 'invalid-vapid-key' | 'no-user'
export interface PushManagerSubscriptionInfo {
  registration: ServiceWorkerRegistration
  subscription: PushSubscription | null
}

export interface RequiredUserLogin extends Required<Omit<UserLogin, 'account' | 'pushSubscription'>> {
  pushSubscription?: mastodon.v1.WebPushSubscription
}

export interface CreatePushNotification {
  alerts?: Partial<mastodon.v1.WebPushSubscriptionAlerts> | null
  policy?: mastodon.v1.WebPushSubscriptionPolicy
}

export type PushNotificationRequest = Record<string, boolean>
export type PushNotificationPolicy = Record<string, mastodon.v1.WebPushSubscriptionPolicy>

export interface CustomEmojisInfo {
  lastUpdate: number
  emojis: mastodon.v1.CustomEmoji[]
}

export type PushSubscriptionErrorCode = 'too_many_registrations' | 'vapid_not_supported' | 'invalid_vapid_key'

export class PushSubscriptionError extends Error {
  code: PushSubscriptionErrorCode
  constructor(code: PushSubscriptionErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
