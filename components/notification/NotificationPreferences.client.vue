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

const showWarning = $computed(() => {
  if (!pwaEnabled)
    return false

  return isSupported
      && (!isSubscribed.value || (
        (!notificationPermission.value || notificationPermission.value === 'prompt')
        && !hiddenNotification.value
      ))
})

const doSubscribe = async () => {
  const subscription = await subscribe()
  // todo: apply some logic based on the result: subscription === 'subscribed'
  // todo: maybe throwing an error instead just a literal to show a dialog with the error
}
</script>

<template>
  <div v-if="pwaEnabled && (showWarning || show)" px5 py4>
    <Transition name="slide-down">
      <div v-if="show" flex="~ col">
        TODO
      </div>
    </Transition>
    <template v-if="showWarning">
      <Transition name="slide-down">
        <div v-if="showWarning" flex="~ col" role="alert" aria-labelledby="notifications-warning">
          <header flex items-center>
            <h2 id="notifications-warning" text-md font-bold w-full>
              {{ $t('notification.settings.warning.enable_title') }}
            </h2>
            <button
              flex rounded-4 p2
              :title="$t('notification.settings.warning.enable_close')"
              hover:bg-active cursor-pointer transition-100
              @click="hiddenNotification = true"
            >
              <span aria-hidden="true" i-ri:close-circle-line />
            </button>
          </header>
          <p>
            {{ $t('notification.settings.warning.enable_description') }}
          </p>
          <button
            btn-outline rounded-full font-bold py4 flex="~ gap2 center" m5
            @click="doSubscribe"
          >
            {{ $t('notification.settings.warning.enable_desktop') }}
          </button>
        </div>
      </Transition>
    </template>
  </div>
</template>
