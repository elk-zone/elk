<script setup lang="ts">
import { usePushManager } from '~/composables/push-notifications/usePushManager'

defineProps<{ show: boolean }>()

const busy = ref(false)

const {
  follow,
  favourite,
  reblog,
  mention,
  poll,
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
  if (busy.value)
    return

  busy.value = true
  try {
    const subscription = await subscribe()
    // todo: apply some logic based on the result: subscription === 'subscribed'
    // todo: maybe throwing an error instead just a literal to show a dialog with the error
  }
  finally {
    busy.value = false
  }
}
const removeSubscription = async () => {
  if (busy.value)
    return

  busy.value = true
  try {
    await unsubscribe()
  }
  finally {
    busy.value = false
  }
}
onActivated(() => (busy.value = false))
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
          <div v-if="isSubscribed" flex="~ col" gap-y-2>
            <CommonCheckbox v-model="follow" :label="$t('notification.settings.follow')" />
            <CommonCheckbox v-model="favourite" :label="$t('notification.settings.favourite')" />
            <CommonCheckbox v-model="reblog" :label="$t('notification.settings.reblog')" />
            <CommonCheckbox v-model="mention" :label="$t('notification.settings.mention')" />
            <CommonCheckbox v-model="poll" :label="$t('notification.settings.poll')" />
            <button
              btn-outline rounded-full font-bold py4 flex="~ gap2 center" m5
              type="button"
              :disabled="busy"
              @click="removeSubscription"
            >
              <span :class="busy ? 'i-ri:loader-2-fill animate-spin' : 'i-ri:check-line'" />
              {{ $t('notification.settings.unsubscribe') }}
            </button>
          </div>
          <template v-else>
            <p v-if="showWarning" role="alert" aria-labelledby="notifications-title">
              {{ $t('notification.settings.unsubscribed_with_warning') }}
            </p>
            <NotificationEnablePushNotification
              v-else
              :busy="busy"
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
    <NotificationEnablePushNotification
      v-if="showWarning"
      with-header
      px5
      py4
      :busy="busy"
      @hide="hideNotification"
      @subscribe="doSubscribe"
    />
  </div>
</template>
