<script setup lang="ts">
defineProps<{ withHeader: boolean }>()

defineEmits(['hide', 'subscribe'])
</script>

<template>
  <div flex="~ col" role="alert" aria-labelledby="notifications-warning" :class="withHeader ? 'border-b border-base' : null">
    <header v-if="withHeader" flex items-center pb-2>
      <h2 id="notifications-warning" text-md font-bold w-full>
        {{ $t('notification.settings.warning.enable_title') }}
      </h2>
      <button
        flex rounded-4 p2
        :title="$t('notification.settings.warning.enable_close')"
        hover:bg-active cursor-pointer transition-100
        @click="$emit('hide')"
      >
        <span aria-hidden="true" i-ri:close-circle-line />
      </button>
    </header>
    <p>
      {{ $t(withHeader ? 'notification.settings.warning.enable_description' : 'notification.settings.warning.enable_description_short') }}
    </p>
    <button
      btn-outline rounded-full font-bold py4 flex="~ gap2 center" m5
      @click="$emit('subscribe')"
    >
      {{ $t('notification.settings.warning.enable_desktop') }}
    </button>
  </div>
</template>
