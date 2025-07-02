<template>
  <button
    v-if="useNuxtApp().$pwa?.needRefresh"
    bg="primary-fade" relative rounded
    flex="~ gap-1 center" px3 py1 text-primary
    @click="useNuxtApp().$pwa?.updateServiceWorker()"
  >
    <div i-ri-download-cloud-2-line />
    <h2 flex="~ gap-2" items-center>
      {{ $t('pwa.update_available_short') }}
    </h2>
  </button>
</template>
