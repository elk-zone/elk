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
    m-2 p-4 w-100 max-w-fit
    bg-base border="~ base"
    rounded
    text-left
    shadow
    flex="~ gap-4"
  >
    <img src="/logo.svg" w-12 h-12 height="10" width="10" ma alt="logo">
    <div>
      <h2 id="pwa-toast-title" sr-only>
        {{ $t('pwa.title') }}
      </h2>
      <div id="pwa-toast-message">
        {{ $t('pwa.message') }}
      </div>
      <div mt2 flex="~ gap-4">
        <button type="button" btn-solid px-4 py-1 text-center text-sm @click="updateServiceWorker()">
          {{ $t('pwa.reload') }}
        </button>
        <button type="button" btn-outline filter-saturate-0 px-4 py-1 text-center text-sm @click="close">
          {{ $t('pwa.dismiss') }}
        </button>
      </div>
    </div>
  </div>
</template>
