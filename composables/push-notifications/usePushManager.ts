import type { SubscriptionPolicy } from 'masto'
import type {
  CreatePushNotification,
  PushNotificationPolicy,
  PushNotificationRequest,
  SubscriptionResult,
} from '~/composables/push-notifications/types'
import { STORAGE_KEY_NOTIFICATION, STORAGE_KEY_NOTIFICATION_POLICY } from '~/constants'
import type { UserLogin } from '~/types'

const supportsPushNotifications = typeof window !== 'undefined'
  && 'serviceWorker' in navigator
  && 'PushManager' in window
  && 'getKey' in PushSubscription.prototype

export const usePushManager = () => {
  const masto = useMasto()
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
    follow: currentUser.value.pushSubscription?.alerts.follow ?? true,
    favourite: currentUser.value.pushSubscription?.alerts.favourite ?? true,
    reblog: currentUser.value.pushSubscription?.alerts.reblog ?? true,
    mention: currentUser.value.pushSubscription?.alerts.mention ?? true,
    poll: currentUser.value.pushSubscription?.alerts.poll ?? true,
    policy: configuredPolicy.value[currentUser.value.account?.acct ?? ''] ?? 'all',
  })
  // don't clone, we're using indexeddb
  const { history, commit, clear } = useManualRefHistory(pushNotificationData)
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

  watch(() => currentUser.value.pushSubscription, (subscription) => {
    isSubscribed.value = !!subscription
    pushNotificationData.value = {
      follow: subscription?.alerts.follow ?? false,
      favourite: subscription?.alerts.favourite ?? false,
      reblog: subscription?.alerts.reblog ?? false,
      mention: subscription?.alerts.mention ?? false,
      poll: subscription?.alerts.poll ?? false,
      policy: configuredPolicy.value[currentUser.value.account?.acct ?? ''] ?? 'all',
    }
  }, { immediate: true, flush: 'post' })

  const subscribe = async (
    notificationData?: CreatePushNotification,
    policy?: SubscriptionPolicy,
    force?: boolean,
  ): Promise<SubscriptionResult> => {
    if (!isSupported)
      return 'not-supported'

    if (isGuest.value)
      return 'no-user'

    const { pushSubscription, server, token, vapidKey, account: { acct } } = currentUser.value as UserLogin<true>

    if (!token || !server || !vapidKey)
      return 'invalid-vapid-key'

    // always request permission, browsers should remember user decision
    const permission = await Promise.resolve(Notification.requestPermission()).then((p) => {
      return p === 'default' ? 'prompt' : p
    })

    if (permission === 'denied') {
      notificationPermission.value = permission
      return 'notification-denied'
    }

    currentUser.value.pushSubscription = await createPushSubscription(
      { pushSubscription, server, token, vapidKey },
      notificationData ?? {
        alerts: {
          follow: true,
          favourite: true,
          reblog: true,
          mention: true,
          poll: true,
        },
      },
      policy ?? 'all',
      force,
    )
    await nextTick()
    notificationPermission.value = permission
    hiddenNotification.value[acct] = true

    return 'subscribed'
  }

  const unsubscribe = async () => {
    if (!isSupported || !isSubscribed || !checkAuth(currentUser.value))
      return false

    await removePushNotifications(currentUser.value)
    await removePushNotificationData(currentUser.value)
  }

  const saveSettings = async (policy?: SubscriptionPolicy) => {
    if (!checkAuth(currentUser.value))
      return

    if (policy)
      pushNotificationData.value.policy = policy

    commit()

    if (policy)
      configuredPolicy.value[currentUser.value.account.acct ?? ''] = policy
    else
      configuredPolicy.value[currentUser.value.account.acct ?? ''] = pushNotificationData.value.policy

    await nextTick()
    clear()
    await nextTick()
  }

  const undoChanges = () => {
    if (!checkAuth(currentUser.value))
      return

    const current = pushNotificationData.value
    const previous = history.value[0].snapshot
    current.favourite = previous.favourite
    current.reblog = previous.reblog
    current.mention = previous.mention
    current.follow = previous.follow
    current.poll = previous.poll
    current.policy = previous.policy
    configuredPolicy.value[currentUser.value.account.acct ?? ''] = previous.policy
    commit()
    clear()
  }

  const updateSubscription = async () => {
    if (currentUser.value) {
      const previous = history.value[0].snapshot
      const data = {
        alerts: {
          follow: pushNotificationData.value.follow,
          favourite: pushNotificationData.value.favourite,
          reblog: pushNotificationData.value.reblog,
          mention: pushNotificationData.value.mention,
          poll: pushNotificationData.value.poll,
        },
      }

      const policy = pushNotificationData.value.policy

      const policyChanged = previous.policy !== policy

      // to change policy we need to resubscribe
      if (policyChanged)
        await subscribe(data, policy, true)
      else
        currentUser.value.pushSubscription = await masto.pushSubscriptions.update({ data })

      policyChanged && await nextTick()

      // force change policy when changed: watch is resetting it on push subscription update
      await saveSettings(policyChanged ? policy : undefined)
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
