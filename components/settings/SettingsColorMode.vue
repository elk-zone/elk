<script setup lang="ts">
import type { ColorMode } from '~/composables/settings'

const colorMode = useColorMode()

function setColorMode(mode: ColorMode) {
  colorMode.preference = mode
}

const modes = [
  {
    icon: 'i-ri-moon-fill',
    label: 'settings.interface.dark_mode',
    mode: 'dark',
  },
  {
    icon: 'i-ri-moon-foggy-line',
    label: 'settings.interface.dim_mode',
    mode: 'dim',
  },
  {
    icon: 'i-ri-sun-line',
    label: 'settings.interface.light_mode',
    mode: 'light',
  },
  {
    icon: 'i-ri-computer-line',
    label: 'settings.interface.system_mode',
    mode: 'system',
  },
] as const
</script>

<template>
  <div flex="~ gap4 wrap" w-full>
    <button
      v-for="{ icon, label, mode } in modes"
      :key="mode"
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base ws-nowrap
      :tabindex="colorMode.preference === mode ? 0 : -1"
      :class="colorMode.preference === mode ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setColorMode(mode)"
    >
      <span :class="`${icon}`" />
      {{ $t(label) }}
    </button>
  </div>
</template>
