<script setup lang="ts">
defineProps<{ show: boolean }>()

let busy = $ref<boolean>(false)
let animateSave = $ref<boolean>(false)
let animateSubscription = $ref<boolean>(false)
let animateRemoveSubscription = $ref<boolean>(false)

const {
  pushNotificationData,
  saveEnabled,
  undoChanges,
  hiddenNotification,
  isSubscribed,
  isSupported,
  notificationPermission,
  updateSubscription,
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

const saveSettings = async () => {
  if (busy)
    return

  busy = true
  await nextTick()
  animateSave = true

  try {
    const subscription = await updateSubscription()
    // todo: handle error
  }
  finally {
    busy = false
    animateSave = false
  }
}

const doSubscribe = async () => {
  if (busy)
    return

  busy = true
  await nextTick()
  animateSubscription = true

  try {
    const subscription = await subscribe()
    // todo: apply some logic based on the result: subscription === 'subscribed'
    // todo: maybe throwing an error instead just a literal to show a dialog with the error
    // todo: handle error
  }
  finally {
    busy = false
    animateSubscription = false
  }
}
const removeSubscription = async () => {
  if (busy)
    return

  busy = true
  await nextTick()
  animateRemoveSubscription = true
  try {
    await unsubscribe()
  }
  finally {
    busy = false
    animateRemoveSubscription = false
  }
}
onActivated(() => (busy = false))
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
          <div v-if="isSubscribed" flex="~ col">
            <form flex="~ col" gap-y-2 @submit.prevent="saveSettings">
              <fieldset flex="~ col" gap-y-1 py-1>
                <legend>{{ $t('notification.settings.alerts.title') }}</legend>
                <CommonCheckbox v-model="pushNotificationData.follow" hover :label="$t('notification.settings.alerts.follow')" />
                <CommonCheckbox v-model="pushNotificationData.favourite" hover :label="$t('notification.settings.alerts.favourite')" />
                <CommonCheckbox v-model="pushNotificationData.reblog" hover :label="$t('notification.settings.alerts.reblog')" />
                <CommonCheckbox v-model="pushNotificationData.mention" hover :label="$t('notification.settings.alerts.mention')" />
                <CommonCheckbox v-model="pushNotificationData.poll" hover :label="$t('notification.settings.alerts.poll')" />
              </fieldset>
              <fieldset flex="~ col" gap-y-1 py-1>
                <legend>{{ $t('notification.settings.policy.title') }}</legend>
                <CommonRadio v-model="pushNotificationData.policy" hover value="all" :label="$t('notification.settings.policy.all')" />
                <CommonRadio v-model="pushNotificationData.policy" hover value="followed" :label="$t('notification.settings.policy.followed')" />
                <CommonRadio v-model="pushNotificationData.policy" hover value="follower" :label="$t('notification.settings.policy.follower')" />
                <CommonRadio v-model="pushNotificationData.policy" hover value="none" :label="$t('notification.settings.policy.none')" />
              </fieldset>
              <div flex="~ col" gap-y-4 py-1 sm="~ justify-between flex-row">
                <button
                  btn-solid font-bold py2 full-w sm-wa flex="~ gap2 center"
                  :class="busy || !saveEnabled ? 'border-transparent' : null"
                  :disabled="busy || !saveEnabled"
                >
                  <span :class="busy && animateSave ? 'i-ri:loader-2-fill animate-spin' : 'i-ri:save-2-fill'" />
                  {{ $t('notification.settings.save_settings') }}
                </button>
                <button
                  btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
                  type="button"
                  :class="busy || !saveEnabled ? 'border-transparent' : null"
                  :disabled="busy || !saveEnabled"
                  @click="undoChanges"
                >
                  <span aria-hidden="true" class="i-material-symbols:undo-rounded" />
                  {{ $t('notification.settings.undo_settings') }}
                </button>
              </div>
            </form>
            <form flex="~ col" mt-4 @submit.prevent="removeSubscription">
              <span border="b base 2px" class="bg-$c-text-secondary" />
              <button
                btn-outline rounded-full font-bold py-4 flex="~ gap2 center" m5
                :class="busy ? 'border-transparent' : null"
                :disabled="busy"
              >
                <span aria-hidden="true" :class="busy && animateRemoveSubscription ? 'i-ri:loader-2-fill animate-spin' : 'i-material-symbols:cancel-rounded'" />
                {{ $t('notification.settings.unsubscribe') }}
              </button>
            </form>
          </div>
          <template v-else>
            <p v-if="showWarning" role="alert" aria-labelledby="notifications-title">
              {{ $t('notification.settings.unsubscribed_with_warning') }}
            </p>
            <NotificationEnablePushNotification
              v-else
              :animate="animateSubscription"
              :busy="busy"
              :show-re-auth-message="!showWarning"
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
      :show-re-auth-message="true"
      with-header
      px5
      py4
      :animate="animateSubscription"
      :busy="busy"
      @hide="hideNotification"
      @subscribe="doSubscribe"
    />
  </div>
</template>
