import type { mastodon } from 'masto'

import type {
  CreatePushNotification,
  PushNotificationPolicy,
  PushNotificationRequest,
  SubscriptionResult,
} from '~/composables/push-notifications/types'
import { STORAGE_KEY_NOTIFICATION, STORAGE_KEY_NOTIFICATION_POLICY } from '~/constants'

const supportsPushNotifications = typeof window !== 'undefined'
  && 'serviceWorker' in navigator
  && 'PushManager' in window
  && 'getKey' in PushSubscription.prototype

export function usePushManager() {
  const { client } = useMasto()
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
  const isSupported = computed(() => supportsPushNotifications)
  const hiddenNotification = useLocalStorage<PushNotificationRequest>(STORAGE_KEY_NOTIFICATION, {})
  const configuredPolicy = useLocalStorage<PushNotificationPolicy>(STORAGE_KEY_NOTIFICATION_POLICY, {})
  const pushNotificationData = ref(createRawSettings(
    currentUser.value?.pushSubscription,
    configuredPolicy.value[currentUser.value?.account?.acct ?? ''],
  ))
  const oldPushNotificationData = ref(createRawSettings(
    currentUser.value?.pushSubscription,
    configuredPolicy.value[currentUser.value?.account?.acct ?? ''],
  ))
  const saveEnabled = computed(() => {
    const current = pushNotificationData.value
    const previous = oldPushNotificationData.value
    return current.favourite !== previous.favourite
      || current.reblog !== previous.reblog
      || current.mention !== previous.mention
      || current.follow !== previous.follow
      || current.poll !== previous.poll
      || current.policy !== previous.policy
  })

  watch(() => currentUser.value?.pushSubscription, (subscription) => {
    isSubscribed.value = !!subscription
    pushNotificationData.value = createRawSettings(
      subscription,
      configuredPolicy.value[currentUser.value?.account?.acct ?? ''],
    )
    oldPushNotificationData.value = createRawSettings(
      subscription,
      configuredPolicy.value[currentUser.value?.account?.acct ?? ''],
    )
  }, { immediate: true, flush: 'post' })

  const subscribe = async (
    notificationData?: CreatePushNotification,
    policy?: mastodon.v1.WebPushSubscriptionPolicy,
    force?: boolean,
  ): Promise<SubscriptionResult> => {
    if (!isSupported.value)
      return 'not-supported'

    if (!currentUser.value)
      return 'no-user'

    const { pushSubscription, server, token, vapidKey, account: { acct } } = currentUser.value

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
      {
        pushSubscription,
        server,
        token,
        vapidKey,
      },
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
    if (!isSupported.value || !isSubscribed.value || !currentUser.value)
      return false

    await removePushNotifications(currentUser.value)
    await removePushNotificationData(currentUser.value)
  }

  const saveSettings = async (policy?: mastodon.v1.WebPushSubscriptionPolicy) => {
    if (policy)
      pushNotificationData.value.policy = policy

    const current = pushNotificationData.value
    oldPushNotificationData.value = {
      favourite: current.favourite,
      reblog: current.reblog,
      mention: current.mention,
      follow: current.follow,
      poll: current.poll,
      policy: current.policy,
    }

    if (policy)
      configuredPolicy.value[currentUser.value!.account.acct ?? ''] = policy
    else
      configuredPolicy.value[currentUser.value!.account.acct ?? ''] = pushNotificationData.value.policy

    await nextTick()
  }

  const undoChanges = () => {
    const previous = oldPushNotificationData.value
    pushNotificationData.value = {
      favourite: previous.favourite,
      reblog: previous.reblog,
      mention: previous.mention,
      follow: previous.follow,
      poll: previous.poll,
      policy: previous.policy,
    }
    configuredPolicy.value[currentUser.value!.account.acct ?? ''] = previous.policy
  }

  const updateSubscription = async () => {
    if (currentUser.value) {
      const previous = oldPushNotificationData.value
      // const previous = history.value[0].snapshot
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
        currentUser.value.pushSubscription = await client.value.v1.push.subscription.update({ data })

      if (policyChanged)
        await nextTick()

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

function createRawSettings(
  pushSubscription?: mastodon.v1.WebPushSubscription,
  subscriptionPolicy?: mastodon.v1.WebPushSubscriptionPolicy,
) {
  return {
    follow: pushSubscription?.alerts.follow ?? true,
    favourite: pushSubscription?.alerts.favourite ?? true,
    reblog: pushSubscription?.alerts.reblog ?? true,
    mention: pushSubscription?.alerts.mention ?? true,
    poll: pushSubscription?.alerts.poll ?? true,
    policy: subscriptionPolicy ?? 'all',
  }
}
