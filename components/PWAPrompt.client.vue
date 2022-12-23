<script setup>
import { usePWA } from '~/composables/pwa'

const { close, needRefresh, updateServiceWorker } = usePWA()
</script>

<!-- TODO: remove shadow on mobile and position it above the bottom nav -->
<template>
  <div
    v-if="needRefresh"
    role="alertdialog"
    aria-labelledby="pwa-toast-title"
    aria-describedby="pwa-toast-description"
    m-2 p5 bg="fade" relative
    rounded-lg of-hidden
    flex="~ col gap-3"
  >
    <h2 id="pwa-toast-title" flex="~ gap-2" items-center>
      {{ $t('pwa.title') }}
    </h2>
    <div flex="~ gap-1">
      <button type="button" btn-solid px-4 py-1 text-center text-sm @click="updateServiceWorker()">
        {{ $t('pwa.update') }}
      </button>
      <button type="button" btn-text filter-saturate-0 px-4 py-1 text-center text-sm @click="close()">
        {{ $t('pwa.dismiss') }}
      </button>
    </div>
    <div i-ri-arrow-down-circle-line absolute text-8em bottom--10 right--10 text-primary op10 />
  </div>
</template>
