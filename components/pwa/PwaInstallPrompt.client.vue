<template>
  <div
    v-if="useNuxtApp().$pwa?.showInstallPrompt && !useNuxtApp().$pwa?.needRefresh"
    m-2 p5 bg="primary-fade" relative
    rounded-lg of-hidden
    flex="~ col gap-3"
    v-bind="$attrs"
  >
    <h2 flex="~ gap-2" items-center>
      {{ $t('pwa.install_title') }}
    </h2>
    <div flex="~ gap-1">
      <button type="button" btn-solid px-4 py-1 text-center text-sm @click="useNuxtApp().$pwa?.install()">
        {{ $t('pwa.install') }}
      </button>
      <button type="button" btn-text filter-saturate-0 px-4 py-1 text-center text-sm @click="useNuxtApp().$pwa?.cancelInstall()">
        {{ $t('pwa.dismiss') }}
      </button>
    </div>
    <div i-material-symbols:install-desktop-rounded absolute text-6em bottom--2 inset-ie--2 text-primary dark:text-white op10 class="-z-1 rtl-flip" />
  </div>
</template>
