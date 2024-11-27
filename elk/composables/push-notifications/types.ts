import type { akkoma } from 'akko'

import type { UserLogin } from '~/types'

export type SubscriptionResult = 'subscribed' | 'notification-denied' | 'not-supported' | 'invalid-vapid-key' | 'no-user'
export interface PushManagerSubscriptionInfo {
  registration: ServiceWorkerRegistration
  subscription: PushSubscription | null
}

export interface RequiredUserLogin extends Required<Omit<UserLogin, 'account' | 'pushSubscription'>> {
  pushSubscription?: akkoma.v1.WebPushSubscription
}

export interface CreatePushNotification {
  alerts?: Partial<akkoma.v1.WebPushSubscriptionAlerts> | null
  policy?: akkoma.v1.WebPushSubscriptionPolicy
}

export type PushNotificationRequest = Record<string, boolean>
export type PushNotificationPolicy = Record<string, akkoma.v1.WebPushSubscriptionPolicy>

export interface CustomEmojisInfo {
  lastUpdate: number
  emojis: akkoma.v1.CustomEmoji[]
}

export type PushSubscriptionErrorCode = 'too_many_registrations' | 'vapid_not_supported' | 'invalid_vapid_key'

export class PushSubscriptionError extends Error {
  code: PushSubscriptionErrorCode
  constructor(code: PushSubscriptionErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
