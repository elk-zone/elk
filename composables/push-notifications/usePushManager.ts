import type { CreatePushNotification, SubscriptionResult } from '~/composables/push-notifications/types'
import { createPushSubscription } from '~/composables/push-notifications/createPushSubscription'

const supportsPushNotifications = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'getKey' in PushSubscription.prototype

export const usePushManager = () => {
  const isSubscribed = ref(false)
  const notificationPermission = ref<PermissionState | undefined>()
  const isSupported = $computed(() => supportsPushNotifications)

  watch(() => currentUser.value?.pushSubscription, (subscription) => {
    isSubscribed.value = !!subscription
  }, { immediate: true, flush: 'post' })

  const subscribe = async (notificationData?: CreatePushNotification): Promise<SubscriptionResult> => {
    if (!isSupported || !currentUser.value)
      return 'invalid-state'

    const { pushSubscription, server, token, vapidKey } = currentUser.value

    if (!token || !server || !vapidKey)
      return 'invalid-state'

    const permission = await navigator.permissions?.query({ name: 'notifications' })

    if (permission.state === 'denied') {
      notificationPermission.value = permission.state
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
    notificationPermission.value = permission.state
    // console.log(currentUser.value.pushSubscription)
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
    isSupported,
    isSubscribed,
    notificationPermission,
    subscribe,
    unsubscribe,
  }
}
