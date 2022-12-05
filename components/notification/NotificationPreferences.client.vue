<script setup lang="ts">
import { usePushManager } from '~/composables/push-notifications/usePushManager'
import { PWA_ENABLED, STORAGE_KEY_NOTIFICATION } from '~/constants'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ (evt: 'warning', enabled: boolean): void }>()

const hiddenNotification = useLocalStorage(STORAGE_KEY_NOTIFICATION, false)

const {
  isSubscribed,
  isSupported,
  notificationPermission,
  subscribe,
  unsubscribe,
} = usePushManager()

const showWarning = $computed(() => {
  if (!PWA_ENABLED)
    return false

  return isSupported
      && (!isSubscribed.value || (
        (!notificationPermission.value || notificationPermission.value === 'prompt')
        && !hiddenNotification.value
      ))
})

const doSubscribe = async () => {
  const subscription = await subscribe()
  if (subscription === 'subscribed')
    notificationPermission.value === 'prompt' && (hiddenNotification.value = true)
  else
    hiddenNotification.value = false

  emit('warning', showWarning)
}

onActivated(() => emit('warning', showWarning))
onBeforeMount(() => emit('warning', showWarning))
</script>

<template>
  <div v-if="PWA_ENABLED" px5 py4>
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
    <template v-else>
      <Transition name="slide-down">
        <div v-if="show" flex="~ col">
          TODO
        </div>
      </Transition>
    </template>
  </div>
</template>
