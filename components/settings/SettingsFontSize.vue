<script lang="ts" setup>
import { DEFAULT_FONT_SIZE } from '~/constants'
import type { FontSize } from '~/composables/settings'

const userSettings = useUserSettings()

const sizes = (new Array(11)).fill(0).map((x, i) => `${10 + i}px`) as FontSize[]

const setFontSize = (e: Event) => {
  if (e.target && 'valueAsNumber' in e.target)
    userSettings.value.fontSize = sizes[e.target.valueAsNumber as number]
}
</script>

<template>
  <div flex items-center space-x-4>
    <span text-xs text-secondary>Aa</span>
    <div flex-1 relative flex items-center>
      <input
        :value="sizes.indexOf(userSettings.fontSize)"
        :aria-valuetext="`${userSettings.fontSize}${userSettings.fontSize === DEFAULT_FONT_SIZE ? ` ${$t('settings.interface.default')}` : ''}`"
        :min="0"
        :max="sizes.length - 1"
        :step="1"
        type="range"
        focus:outline-none
        appearance-none bg-transparent
        w-full cursor-pointer
        @change="setFontSize"
      >
      <div absolute h1 rounded-full bg-primary pointer-events-none :style="{ width: `${(sizes.indexOf(userSettings.fontSize)) / (sizes.length - 1) * 100}%` }" />
      <div flex justify-between absolute w-full pointer-events-none>
        <div v-for="i in sizes.length" :key="i" h-3 w-3 rounded-full bg-primary />
      </div>
    </div>
    <span text-xl text-secondary>Aa</span>
  </div>
</template>

<style>
  input[type=range]::-webkit-slider-runnable-track {
    --at-apply: bg-primary-light rounded-full h1;
  }
  input[type=range]:focus:-webkit-slider-runnable-track {
    --at-apply: outline-2 outline-red;
  }
  input[type=range]::-webkit-slider-thumb {
    --at-apply: w4 h4 bg-primary -mt-1.5 outline outline-3 outline-primary rounded-full cursor-pointer appearance-none;
  }
  input[type=range]::-moz-range-track {
    --at-apply: bg-primary-light rounded-full h1;
  }
  input[type=range]:focus::-moz-range-track {
    --at-apply: outline-2 outline-red;
  }
  input[type=range]::-moz-range-thumb {
    --at-apply: w4 h4 bg-primary -mt-1.5 outline outline-3 outline-primary rounded-full cursor-pointer appearance-none border-none;
  }
</style>
