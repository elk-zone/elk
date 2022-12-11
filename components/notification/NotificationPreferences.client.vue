<script setup lang="ts">
import { usePushManager } from '~/composables/push-notifications/usePushManager'

defineProps<{ show: boolean }>()

const {
  hiddenNotification,
  isSubscribed,
  isSupported,
  notificationPermission,
  subscribe,
  unsubscribe,
} = usePushManager()
const pwaEnabled = useRuntimeConfig().public.pwaEnabled

const hideNotification = () => {
  const key = currentUser.value?.account?.acct
  if (key)
    hiddenNotification.value[key] = true
}

const showWarning = $computed(() => {
  if (!pwaEnabled)
    return false

  return isSupported
      && (!isSubscribed.value || !notificationPermission.value || notificationPermission.value === 'prompt')
      && !(hiddenNotification.value[currentUser.value?.account?.acct ?? ''] === true)
})

const doSubscribe = async () => {
  const subscription = await subscribe()
  // todo: apply some logic based on the result: subscription === 'subscribed'
  // todo: maybe throwing an error instead just a literal to show a dialog with the error
}
</script>

<template>
  <div v-if="pwaEnabled && (showWarning || show)">
    <Transition name="slide-down">
      <div v-if="show" flex="~ col" border="b base" px5 py4>
        <header flex items-center pb-2>
          <h2 id="notifications-title" text-md font-bold w-full>
            {{ $t('notification.settings.title') }}
          </h2>
        </header>
        <template v-if="isSupported">
          <template v-if="isSubscribed">
            TODO: SETTINGS HERE
          </template>
          <template v-else>
            <p v-if="showWarning" role="alert" aria-labelledby="notifications-title">
              {{ $t('notification.settings.unsubscribed_with_warning') }}
            </p>
            <NotificationEnablePushNotification
              v-else
              @hide="hideNotification"
              @subscribe="doSubscribe"
            />
          </template>
        </template>
        <p v-else role="alert" aria-labelledby="notifications-unsupported">
          {{ $t('notification.settings.unsupported') }}
        </p>
      </div>
    </Transition>
    <template v-if="showWarning">
      <NotificationEnablePushNotification
        with-header
        px5
        py4
        @hide="hideNotification"
        @subscribe="doSubscribe"
      />
    </template>
  </div>
</template>
