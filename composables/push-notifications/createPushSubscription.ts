import type {
  CreatePushSubscriptionParams,
  PushSubscription as MastoPushSubscription,
} from 'masto'
import type {
  CreatePushNotification,
  PushManagerSubscriptionInfo,
  RequiredUserLogin,
} from '~/composables/push-notifications/types'
import { useMasto } from '~/composables/masto'
import { currentUser, removePushNotifications } from '~/composables/users'

export const createPushSubscription = async (
  user: RequiredUserLogin,
  notificationData: CreatePushNotification,
): Promise<MastoPushSubscription | undefined> => {
  const { server: serverEndpoint, vapidKey } = user

  return await getRegistration()
    .then(getPushSubscription)
    .then(({ registration, subscription }): Promise<MastoPushSubscription | undefined> => {
      if (subscription) {
        const currentServerKey = (new Uint8Array(subscription.options.applicationServerKey!)).toString()
        const subscriptionServerKey = urlBase64ToUint8Array(vapidKey).toString()

        // If the VAPID public key did not change and the endpoint corresponds
        // to the endpoint saved in the backend, the subscription is valid
        // If push subscription is not there, we need to create it: it is fetched on login
        if (subscriptionServerKey === currentServerKey && subscription.endpoint === serverEndpoint && user.pushSubscription) {
          return Promise.resolve(user.pushSubscription)
        }
        else if (user.pushSubscription) {
          // if we have a subscription, but it is not valid, we need to remove it
          return unsubscribeFromBackend(false)
            .then(() => subscribe(registration, vapidKey))
            .then(subscription => sendSubscriptionToBackend(subscription, notificationData))
        }
      }

      return subscribe(registration, vapidKey).then(
        subscription => sendSubscriptionToBackend(subscription, notificationData),
      )
    })
    .catch((error) => {
      if (error.code === 20 && error.name === 'AbortError')
        console.warn('Your browser supports Web Push Notifications, but does not seem to implement the VAPID protocol.')
      else if (error.code === 5 && error.name === 'InvalidCharacterError')
        console.error('The VAPID public key seems to be invalid:', vapidKey)

      return getRegistration()
        .then(getPushSubscription)
        .then(() => unsubscribeFromBackend(true))
        .then(() => Promise.resolve(undefined))
        .catch((e) => {
          console.error(e)
          return Promise.resolve(undefined)
        })
    })
}

// Taken from https://www.npmjs.com/package/web-push
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = `${base64String}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i)

  return outputArray
}

function getRegistration() {
  return navigator.serviceWorker.ready
}
async function getPushSubscription(registration: ServiceWorkerRegistration): Promise<PushManagerSubscriptionInfo> {
  const subscription = await registration.pushManager.getSubscription()
  return { registration, subscription }
}

async function subscribe(
  registration: ServiceWorkerRegistration,
  applicationServerKey: string,
): Promise<PushSubscription> {
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
  })
}

async function unsubscribeFromBackend(fromSWPushManager: boolean) {
  const cu = currentUser.value
  if (cu)
    await removePushNotifications(cu, fromSWPushManager)
}

async function sendSubscriptionToBackend(
  subscription: PushSubscription,
  data: CreatePushNotification,
): Promise<MastoPushSubscription> {
  const { endpoint, keys } = subscription.toJSON()
  const params: CreatePushSubscriptionParams = {
    subscription: {
      endpoint: endpoint!,
      keys: {
        p256dh: keys!.p256dh!,
        auth: keys!.auth!,
      },
    },
    data,
  }

  return await useMasto().pushSubscriptions.create(params)
}
