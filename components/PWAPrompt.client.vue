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
    animate animate-back-in-up md:animate-back-in-right
    z11
    fixed
    bottom-14 md:bottom-0 right-0
    m-2 p-4
    bg-base border="~ base"
    rounded
    text-left
    shadow
  >
    <h2 id="pwa-toast-title" sr-only>
      {{ $t('pwa.title') }}
    </h2>
    <div id="pwa-toast-message">
      {{ $t('pwa.message') }}
    </div>
    <div m-t4 flex="~ colum" gap-x="4">
      <button type="button" btn-solid text-sm px-2 py-1 text-center @click="updateServiceWorker()">
        {{ $t('pwa.reload') }}
      </button>
      <button type="button" btn-outline px-2 py-1 text-sm text-center @click="close">
        {{ $t('pwa.close') }}
      </button>
    </div>
  </div>
</template>
