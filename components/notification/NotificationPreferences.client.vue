<script setup lang="ts">
defineProps<{ show?: boolean }>()

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
const { t } = useI18n()

const pwaEnabled = useAppConfig().pwaEnabled

const busy = ref<boolean>(false)
const animateSave = ref<boolean>(false)
const animateSubscription = ref<boolean>(false)
const animateRemoveSubscription = ref<boolean>(false)
const subscribeError = ref<string>('')
const showSubscribeError = ref<boolean>(false)

function hideNotification() {
  const key = currentUser.value?.account?.acct
  if (key)
    hiddenNotification.value[key] = true
}

const showWarning = computed(() => {
  if (!pwaEnabled)
    return false

  return isSupported
    && (!isSubscribed.value || !notificationPermission.value || notificationPermission.value === 'prompt')
    && !(hiddenNotification.value[currentUser.value?.account?.acct ?? ''])
})

async function saveSettings() {
  if (busy.value)
    return

  busy.value = true
  await nextTick()
  animateSave.value = true

  try {
    await updateSubscription()
  }
  catch (err) {
    // todo: handle error
    console.error(err)
  }
  finally {
    busy.value = false
    animateSave.value = false
  }
}

async function doSubscribe() {
  if (busy.value)
    return

  busy.value = true
  await nextTick()
  animateSubscription.value = true

  try {
    const result = await subscribe()
    if (result !== 'subscribed') {
      subscribeError.value = t(`settings.notifications.push_notifications.subscription_error.${result === 'notification-denied' ? 'permission_denied' : 'request_error'}`)
      showSubscribeError.value = true
    }
  }
  catch (err) {
    if (err instanceof PushSubscriptionError) {
      subscribeError.value = t(`settings.notifications.push_notifications.subscription_error.${err.code}`)
    }
    else {
      console.error(err)
      subscribeError.value = t('settings.notifications.push_notifications.subscription_error.request_error')
    }
    showSubscribeError.value = true
  }
  finally {
    busy.value = false
    animateSubscription.value = false
  }
}
async function removeSubscription() {
  if (busy.value)
    return

  busy.value = true
  await nextTick()
  animateRemoveSubscription.value = true
  try {
    await unsubscribe()
  }
  catch (err) {
    console.error(err)
  }
  finally {
    busy.value = false
    animateRemoveSubscription.value = false
  }
}
onActivated(() => (busy.value = false))
</script>

<template>
  <section v-if="pwaEnabled && (showWarning || show)" aria-labelledby="pn-s">
    <Transition name="slide-down">
      <div v-if="show" flex="~ col" border="b base">
        <h3 id="pn-settings" px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
          {{ $t('settings.notifications.push_notifications.label') }}
        </h3>
        <template v-if="isSupported">
          <div v-if="isSubscribed" flex="~ col">
            <form flex="~ col" gap-y-2 px6 pb4 @submit.prevent="saveSettings">
              <p id="pn-instructions" text-sm pb2 aria-hidden="true">
                {{ $t('settings.notifications.push_notifications.instructions') }}
              </p>
              <fieldset flex="~ col" gap-y-1 py-1>
                <legend>{{ $t('settings.notifications.push_notifications.alerts.title') }}</legend>
                <CommonCheckbox v-model="pushNotificationData.follow" hover :label="$t('settings.notifications.push_notifications.alerts.follow')" />
                <CommonCheckbox v-model="pushNotificationData.favourite" hover :label="$t('settings.notifications.push_notifications.alerts.favourite')" />
                <CommonCheckbox v-model="pushNotificationData.reblog" hover :label="$t('settings.notifications.push_notifications.alerts.reblog')" />
                <CommonCheckbox v-model="pushNotificationData.mention" hover :label="$t('settings.notifications.push_notifications.alerts.mention')" />
                <CommonCheckbox v-model="pushNotificationData.poll" hover :label="$t('settings.notifications.push_notifications.alerts.poll')" />
              </fieldset>
              <fieldset flex="~ col" gap-y-1 py-1>
                <legend>{{ $t('settings.notifications.push_notifications.policy.title') }}</legend>
                <CommonRadio v-model="pushNotificationData.policy" hover value="all" :label="$t('settings.notifications.push_notifications.policy.all')" />
                <CommonRadio v-model="pushNotificationData.policy" hover value="followed" :label="$t('settings.notifications.push_notifications.policy.followed')" />
                <CommonRadio v-model="pushNotificationData.policy" hover value="follower" :label="$t('settings.notifications.push_notifications.policy.follower')" />
                <CommonRadio v-model="pushNotificationData.policy" hover value="none" :label="$t('settings.notifications.push_notifications.policy.none')" />
              </fieldset>
              <div flex="~ col" gap-y-4 gap-x-2 py-1 sm="~ justify-between flex-row">
                <button
                  btn-solid font-bold py2 full-w sm-wa flex="~ gap2 center"
                  :class="busy || !saveEnabled ? 'border-transparent' : null"
                  :disabled="busy || !saveEnabled"
                >
                  <span v-if="busy && animateSave" aria-hidden="true" block animate-spin preserve-3d>
                    <span block i-ri:loader-2-fill aria-hidden="true" />
                  </span>
                  <span v-else block aria-hidden="true" i-ri:save-2-fill />
                  {{ $t('settings.notifications.push_notifications.save_settings') }}
                </button>
                <button
                  btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
                  type="button"
                  :class="busy || !saveEnabled ? 'border-transparent' : null"
                  :disabled="busy || !saveEnabled"
                  @click="undoChanges"
                >
                  <span aria-hidden="true" class="block i-material-symbols:undo-rounded" />
                  {{ $t('settings.notifications.push_notifications.undo_settings') }}
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
                <span v-if="busy && animateRemoveSubscription" aria-hidden="true" block animate-spin preserve-3d>
                  <span block i-ri:loader-2-fill aria-hidden="true" />
                </span>
                <span v-else block aria-hidden="true" i-material-symbols:cancel-rounded />
                {{ $t('settings.notifications.push_notifications.unsubscribe') }}
              </button>
            </form>
          </div>
          <template v-else>
            <NotificationEnablePushNotification
              :animate="animateSubscription"
              :busy="busy"
              @hide="hideNotification"
              @subscribe="doSubscribe"
            >
              <template #error>
                <Transition name="slide-down">
                  <NotificationSubscribePushNotificationError
                    v-model="showSubscribeError"
                    :message="subscribeError"
                  />
                </transition>
              </template>
            </NotificationEnablePushNotification>
          </template>
        </template>
        <div v-else px6 pb4 role="alert" aria-labelledby="n-unsupported">
          <p id="n-unsupported">
            {{ $t('settings.notifications.push_notifications.unsupported') }}
          </p>
        </div>
      </div>
    </Transition>
    <NotificationEnablePushNotification
      v-if="showWarning && !show"
      closeable-header
      px5
      py4
      :animate="animateSubscription"
      :busy="busy"
      @hide="hideNotification"
      @subscribe="doSubscribe"
    >
      <template #error>
        <Transition name="slide-down">
          <NotificationSubscribePushNotificationError
            v-model="showSubscribeError"
            :message="subscribeError"
          />
        </Transition>
      </template>
    </NotificationEnablePushNotification>
  </section>
</template>
