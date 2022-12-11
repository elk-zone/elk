import type { CreatePushNotification, SubscriptionResult } from '~/composables/push-notifications/types'
import { createPushSubscription } from '~/composables/push-notifications/createPushSubscription'
import { STORAGE_KEY_NOTIFICATION } from '~/constants'

const supportsPushNotifications = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'getKey' in PushSubscription.prototype

export const usePushManager = () => {
  const isSubscribed = ref(false)
  const notificationPermission = ref<PermissionState | undefined>(
    Notification.permission === 'denied'
      ? 'denied'
      : Notification.permission === 'granted'
        ? 'granted'
        : Notification.permission === 'default'
          ? 'prompt'
          : undefined,
  )
  const isSupported = $computed(() => supportsPushNotifications)
  const hiddenNotification = useLocalStorage(STORAGE_KEY_NOTIFICATION, false)

  watch(() => currentUser.value?.pushSubscription, (subscription) => {
    isSubscribed.value = !!subscription
  }, { immediate: true, flush: 'post' })

  const subscribe = async (notificationData?: CreatePushNotification): Promise<SubscriptionResult> => {
    if (!isSupported || !currentUser.value)
      return 'invalid-state'

    const { pushSubscription, server, token, vapidKey } = currentUser.value

    if (!token || !server || !vapidKey)
      return 'invalid-state'

    let permission: PermissionState | undefined

    if (!notificationPermission.value || (notificationPermission.value === 'prompt' && !hiddenNotification.value)) {
      // safari 16 does not support navigator.permissions.query for notifications
      try {
        permission = (await navigator.permissions?.query({ name: 'notifications' }))?.state
      }
      catch {
        permission = await Promise.resolve(Notification.requestPermission()).then((p: NotificationPermission) => {
          return p === 'default' ? 'prompt' : p
        })
      }
    }

    if (!permission || permission === 'denied') {
      notificationPermission.value = permission
      return 'notification-denied'
    }

    currentUser.value.pushSubscription = await createPushSubscription({
      pushSubscription, server, token, vapidKey,
    }, notificationData ?? {
      alerts: {
        follow: true,
        favourite: true,
        reblog: true,
        mention: true,
        poll: true,
      },
      policy: 'all',
    })
    await nextTick()
    notificationPermission.value = permission
    hiddenNotification.value = true

    return 'subscribed'
  }

  const unsubscribe = async () => {
    if (!isSupported || !isSubscribed)
      return false

    await useMasto().pushSubscriptions.remove()

    if (currentUser.value)
      currentUser.value.pushSubscription = undefined
  }

  return {
    hiddenNotification,
    isSupported,
    isSubscribed,
    notificationPermission,
    subscribe,
    unsubscribe,
  }
}
