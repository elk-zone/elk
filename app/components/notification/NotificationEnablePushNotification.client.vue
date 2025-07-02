<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

defineProps<{
  closeableHeader?: boolean
  busy?: boolean
  animate?: boolean
}>()

defineEmits(['hide', 'subscribe'])

defineSlots<{
  error: (props: object) => void
}>()

const xl = useMediaQuery('(min-width: 1280px)')

const isLegacyAccount = computed(() => !currentUser.value?.vapidKey)
</script>

<template>
  <div
    flex="~ col"
    gap-y-2
    role="alert"
    aria-labelledby="notifications-warning"
    :class="closeableHeader ? 'border-b border-base' : 'px6 px4'"
  >
    <header flex items-center pb-2>
      <h2 id="notifications-warning" text-md font-bold w-full>
        {{ $t('settings.notifications.push_notifications.warning.enable_title') }}
      </h2>
      <button
        v-if="closeableHeader"
        flex rounded-4
        type="button"
        :title="$t('settings.notifications.push_notifications.warning.enable_close')"
        hover:bg-active cursor-pointer transition-100
        :disabled="busy"
        @click="$emit('hide')"
      >
        <span aria-hidden="true" i-ri:close-line />
      </button>
    </header>
    <template v-if="closeableHeader">
      <p xl:hidden>
        {{ $t('settings.notifications.push_notifications.warning.enable_description') }}
      </p>
      <p xl:hidden>
        {{ $t('settings.notifications.push_notifications.warning.enable_description_mobile') }}
      </p>
      <p :class="xl ? null : 'hidden'">
        {{ $t('settings.notifications.push_notifications.warning.enable_description_desktop') }}
      </p>
    </template>
    <p v-else>
      {{ $t('settings.notifications.push_notifications.warning.enable_description_settings') }}
    </p>
    <p v-if="isLegacyAccount">
      {{ $t('settings.notifications.push_notifications.warning.re_auth') }}
    </p>
    <button
      btn-outline rounded-full font-bold py4 flex="~ gap2 center" m5
      type="button"
      :class="busy || isLegacyAccount ? 'border-transparent' : null"
      :disabled="busy || isLegacyAccount"
      @click="$emit('subscribe')"
    >
      <span v-if="busy && animate" aria-hidden="true" block animate-spin preserve-3d>
        <span block i-ri:loader-2-fill aria-hidden="true" />
      </span>
      <span v-else aria-hidden="true" block i-ri:check-line />
      <span>{{ $t('settings.notifications.push_notifications.warning.enable_desktop') }}</span>
    </button>
    <slot name="error" />
  </div>
</template>
