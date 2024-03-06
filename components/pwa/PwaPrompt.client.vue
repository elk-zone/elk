<template>
  <div
    v-if="useNuxtApp().$pwa?.needRefresh"
    m-2 p5 bg="primary-fade" relative
    rounded-lg of-hidden
    flex="~ col gap-3"
  >
    <h2 flex="~ gap-2" items-center>
      {{ $t('pwa.title') }}
    </h2>
    <div flex="~ gap-1">
      <button type="button" btn-solid px-4 py-1 text-center text-sm @click="useNuxtApp().$pwa?.updateServiceWorker()">
        {{ $t('pwa.update') }}
      </button>
      <button type="button" btn-text filter-saturate-0 px-4 py-1 text-center text-sm @click="useNuxtApp().$pwa?.close()">
        {{ $t('pwa.dismiss') }}
      </button>
    </div>
    <div i-ri-arrow-down-circle-line absolute text-8em bottom--10 inset-ie--10 text-primary dark:text-white op10 class="-z-1" />
  </div>
</template>
