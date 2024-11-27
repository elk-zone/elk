<script setup lang="ts">
import type { ColorMode } from '~/composables/settings'

const colorMode = useColorMode()

function setColorMode(mode: ColorMode) {
  colorMode.preference = mode
}

const modes = [
  {
    icon: 'i-ri-moon-line',
    label: 'settings.interface.dark_mode',
    mode: 'dark',
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
  <section space-y-2>
    <h2 id="interface-cm" font-medium>
      {{ $t('settings.interface.color_mode') }}
    </h2>
    <div flex="~ gap4 wrap" w-full role="group" aria-labelledby="interface-cm">
      <button
        v-for="{ icon, label, mode } in modes"
        :key="mode"
        type="button"
        btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base ws-nowrap
        :aria-pressed="colorMode.preference === mode ? 'true' : 'false'"
        :class="colorMode.preference === mode ? 'pointer-events-none' : 'filter-saturate-0'"
        @click="setColorMode(mode)"
      >
        <span :class="`${icon}`" />
        {{ $t(label) }}
      </button>
    </div>
  </section>
</template>
