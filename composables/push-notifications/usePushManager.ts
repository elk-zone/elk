import type { CreatePushNotification, PushNotificationRequest, SubscriptionResult } from '~/composables/push-notifications/types'
import { createPushSubscription } from '~/composables/push-notifications/createPushSubscription'
import { STORAGE_KEY_NOTIFICATION } from '~/constants'
import { currentUser, removePushNotifications } from '~/composables/users'

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
  const hiddenNotification = useLocalStorage<PushNotificationRequest>(STORAGE_KEY_NOTIFICATION, {})
  const follow = ref(currentUser.value?.pushSubscription?.alerts.follow ?? false)
  const favourite = ref(currentUser.value?.pushSubscription?.alerts.favourite ?? false)
  const reblog = ref(currentUser.value?.pushSubscription?.alerts.reblog ?? false)
  const mention = ref(currentUser.value?.pushSubscription?.alerts.mention ?? false)
  const poll = ref(currentUser.value?.pushSubscription?.alerts.poll ?? false)
  const ready = ref(false)

  watch(() => currentUser.value?.pushSubscription, (subscription) => {
    isSubscribed.value = !!subscription
  }, { immediate: true, flush: 'post' })

  const subscribe = async (notificationData?: CreatePushNotification): Promise<SubscriptionResult> => {
    if (!isSupported || !currentUser.value)
      return 'invalid-state'

    const { pushSubscription, server, token, vapidKey, account: { acct } } = currentUser.value

    if (!token || !server || !vapidKey)
      return 'invalid-state'

    let permission: PermissionState | undefined

    if (!notificationPermission.value || (notificationPermission.value === 'prompt' && !hiddenNotification.value[acct])) {
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
    hiddenNotification.value[acct] = true

    return 'subscribed'
  }

  const unsubscribe = async () => {
    if (!isSupported || !isSubscribed || !currentUser.value)
      return false

    await removePushNotifications(currentUser.value)
  }

  const updateSubscription = () => {
    if (ready.value) {
      try {
        useMasto().pushSubscriptions.update({
          data: {
            alerts: {
              follow: follow.value,
              favourite: favourite.value,
              reblog: reblog.value,
              mention: mention.value,
              poll: poll.value,
            },
          },
        }).then((s) => {
          if (ready?.value && currentUser?.value)
            currentUser.value.pushSubscription = s
        })
      }
      catch {
        // ignore
      }
    }
  }

  watchThrottled(follow, updateSubscription, { throttle: 100 })
  watchThrottled(favourite, updateSubscription, { throttle: 100 })
  watchThrottled(reblog, updateSubscription, { throttle: 100 })
  watchThrottled(mention, updateSubscription, { throttle: 100 })
  watchThrottled(poll, updateSubscription, { throttle: 100 })

  onActivated(() => nextTick().then(() => ready.value = true))
  onMounted(() => nextTick().then(() => ready.value = true))
  onDeactivated(() => nextTick().then(() => ready.value = false))
  onUnmounted(() => nextTick().then(() => ready.value = false))

  return {
    follow,
    favourite,
    reblog,
    mention,
    poll,
    hiddenNotification,
    isSupported,
    isSubscribed,
    notificationPermission,
    subscribe,
    unsubscribe,
  }
}
