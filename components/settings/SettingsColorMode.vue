<script setup lang="ts">
import type { ColorMode } from '~/types'

const colorMode = useColorModeRef()

function setColorMode(mode: ColorMode) {
  colorMode.value = mode
}
</script>

<template>
  <div flex="~ gap4" w-full>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base
      :class="colorMode === 'dark' ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setColorMode('dark')"
    >
      <div i-ri:moon-line />
      Dark Mode
    </button>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base
      :class="colorMode === 'light' ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setColorMode('light')"
    >
      <div i-ri:sun-line />
      Light Mode
    </button>
  </div>
</template>
