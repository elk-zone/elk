<script setup lang="ts">
defineProps<{
  closeableHeader?: boolean
  busy?: boolean
  animate?: boolean
}>()

defineEmits(['hide', 'subscribe'])

defineSlots<{
  error: {}
}>()

const isLegacyAccount = computed(() => !currentUser.value.vapidKey)
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
    <p>
      {{ $t(`settings.notifications.push_notifications.warning.enable_description${closeableHeader ? '' : '_settings'}`) }}
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
      <span aria-hidden="true" :class="busy && animate ? 'i-ri:loader-2-fill animate-spin' : 'i-ri:check-line'" />
      {{ $t('settings.notifications.push_notifications.warning.enable_desktop') }}
    </button>
    <slot name="error" />
  </div>
</template>
