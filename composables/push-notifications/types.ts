import type { Emoji, PushSubscription as MastoPushSubscription, PushSubscriptionAlerts, SubscriptionPolicy } from 'masto'

import type { UserLogin } from '~/types'

export type SubscriptionResult = 'subscribed' | 'notification-denied' | 'invalid-state'
export interface PushManagerSubscriptionInfo {
  registration: ServiceWorkerRegistration
  subscription: PushSubscription | null
}

export interface RequiredUserLogin extends Required<Omit<UserLogin, 'account' | 'pushSubscription'>> {
  pushSubscription?: MastoPushSubscription
}

export interface CreatePushNotification {
  alerts?: Partial<PushSubscriptionAlerts> | null
  policy?: SubscriptionPolicy
}

export type PushNotificationRequest = Record<string, boolean>
export type PushNotificationPolicy = Record<string, SubscriptionPolicy>

export interface CustomEmojisInfo {
  lastUpdate: number
  emojis: Emoji[]
}
