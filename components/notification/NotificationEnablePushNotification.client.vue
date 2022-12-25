<script setup lang="ts">
defineProps<{
  withHeader?: boolean
  busy?: boolean
  animate?: boolean
}>()

defineEmits(['hide', 'subscribe'])
const isLegacyAccount = computed(() => !currentUser.value?.vapidKey)
</script>

<template>
  <div flex="~ col" role="alert" aria-labelledby="notifications-warning" :class="withHeader ? 'border-b border-base' : null">
    <header v-if="withHeader" flex items-center pb-2>
      <h2 id="notifications-warning" text-md font-bold w-full>
        {{ $t('notification.settings.warning.enable_title') }}
      </h2>
      <button
        flex rounded-4
        type="button"
        :title="$t('notification.settings.warning.enable_close')"
        hover:bg-active cursor-pointer transition-100
        :disabled="busy"
        @click="$emit('hide')"
      >
        <span aria-hidden="true" i-ri:close-line />
      </button>
    </header>
    <p>
      {{ $t(withHeader ? 'notification.settings.warning.enable_description' : 'notification.settings.warning.enable_description_short') }}
    </p>
    <button
      btn-outline rounded-full font-bold py4 flex="~ gap2 center" m5
      type="button"
      :class="busy || isLegacyAccount ? 'border-transparent' : null"
      :disabled="busy || isLegacyAccount"
      @click="$emit('subscribe')"
    >
      <span aria-hidden="true" :class="busy && animate ? 'i-ri:loader-2-fill animate-spin' : 'i-ri:check-line'" />
      {{ $t('notification.settings.warning.enable_desktop') }}
    </button>
  </div>
</template>
