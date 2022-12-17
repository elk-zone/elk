import type {
  CreatePushNotification,
  PushNotificationPolicy,
  PushNotificationRequest,
  SubscriptionResult,
} from '~/composables/push-notifications/types'
import { createPushSubscription } from '~/composables/push-notifications/createPushSubscription'
import { STORAGE_KEY_NOTIFICATION, STORAGE_KEY_NOTIFICATION_POLICY } from '~/constants'
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
  const configuredPolicy = useLocalStorage<PushNotificationPolicy>(STORAGE_KEY_NOTIFICATION_POLICY, {})
  const pushNotificationData = ref({
    follow: currentUser.value?.pushSubscription?.alerts.follow ?? true,
    favourite: currentUser.value?.pushSubscription?.alerts.favourite ?? true,
    reblog: currentUser.value?.pushSubscription?.alerts.reblog ?? true,
    mention: currentUser.value?.pushSubscription?.alerts.mention ?? true,
    poll: currentUser.value?.pushSubscription?.alerts.poll ?? true,
    policy: configuredPolicy.value[currentUser.value?.account?.acct ?? ''] ?? 'all',
  })
  const { history, commit, clear } = useManualRefHistory(pushNotificationData, { clone: true })
  const saveEnabled = computed(() => {
    const current = pushNotificationData.value
    const previous = history.value?.[0]?.snapshot
    return current.favourite !== previous.favourite
      || current.reblog !== previous.reblog
      || current.mention !== previous.mention
      || current.follow !== previous.follow
      || current.poll !== previous.poll
      || current.policy !== previous.policy
  })

  watch(() => currentUser.value?.pushSubscription, (subscription) => {
    isSubscribed.value = !!subscription
    pushNotificationData.value = {
      follow: subscription?.alerts.follow ?? false,
      favourite: subscription?.alerts.favourite ?? false,
      reblog: subscription?.alerts.reblog ?? false,
      mention: subscription?.alerts.mention ?? false,
      poll: subscription?.alerts.poll ?? false,
      policy: configuredPolicy.value[currentUser.value?.account?.acct ?? ''] ?? 'all',
    }
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
    else {
      permission = notificationPermission.value
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

  const saveSettings = async () => {
    commit()
    configuredPolicy.value[currentUser.value!.account.acct ?? ''] = pushNotificationData.value.policy
    await nextTick()
    clear()
    await nextTick()
  }

  const undoChanges = () => {
    const current = pushNotificationData.value
    const previous = history.value[0].snapshot
    current.favourite = previous.favourite
    current.reblog = previous.reblog
    current.mention = previous.mention
    current.follow = previous.follow
    current.poll = previous.poll
    current.policy = previous.policy
    configuredPolicy.value[currentUser.value!.account.acct ?? ''] = previous.policy
    commit()
    clear()
  }

  const updateSubscription = async () => {
    if (currentUser.value) {
      currentUser.value.pushSubscription = await useMasto().pushSubscriptions.update({
        data: {
          alerts: {
            follow: pushNotificationData.value.follow,
            favourite: pushNotificationData.value.favourite,
            reblog: pushNotificationData.value.reblog,
            mention: pushNotificationData.value.mention,
            poll: pushNotificationData.value.poll,
          },
          policy: pushNotificationData.value.policy,
        },
      })
      await saveSettings()
    }
  }

  return {
    pushNotificationData,
    saveEnabled,
    undoChanges,
    hiddenNotification,
    isSupported,
    isSubscribed,
    notificationPermission,
    updateSubscription,
    subscribe,
    unsubscribe,
  }
}
