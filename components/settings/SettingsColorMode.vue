<script setup lang="ts">
import type { ColorMode } from '~/composables/settings'

const colorMode = useColorMode()

function setColorMode(mode: ColorMode) {
  colorMode.preference = mode
}
</script>

<template>
  <div flex="~ gap4 wrap" w-full>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base ws-nowrap
      :tabindex="colorMode.preference === 'dark' ? 0 : -1"
      :class="colorMode.preference === 'dark' ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setColorMode('dark')"
    >
      <div i-ri:moon-line />
      {{ $t('settings.interface.dark_mode') }}
    </button>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base ws-nowrap
      :tabindex="colorMode.preference === 'light' ? 0 : -1"
      :class="colorMode.preference === 'light' ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setColorMode('light')"
    >
      <div i-ri:sun-line />
      {{ $t('settings.interface.light_mode') }}
    </button>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base ws-nowrap
      :tabindex="colorMode.preference === 'system' ? 0 : -1"
      :class="colorMode.preference === 'system' ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setColorMode('system')"
    >
      <div i-ri:computer-line />
      {{ $t('settings.interface.system_mode') }}
    </button>
  </div>
</template>
