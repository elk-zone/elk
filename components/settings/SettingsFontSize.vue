<script lang="ts" setup>
import { DEFAULT_FONT_SIZE } from '~/constants'
import type { FontSize } from '~/types'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as FontSize[]
const fontSize = useFontSizeRef()

const setFontSize = (e: Event) => {
  if (e.target && 'valueAsNumber' in e.target)
    fontSize.value = sizes[e.target.valueAsNumber as number]
}
</script>

<template>
  <div flex items-center space-x-4>
    <span text-xs text-secondary>Aa</span>
    <div flex-1 relative flex items-center>
      <input
        :value="sizes.indexOf(fontSize)"
        :aria-valuetext="`${$t(`settings.interface.size_label.${fontSize}`)}${fontSize === DEFAULT_FONT_SIZE ? $t('settings.interface.default') : ''}`"
        :min="0"
        :max="sizes.length - 1"
        :step="1"
        type="range"
        focus:outline-none
        appearance-none bg-transparent
        w-full cursor-pointer
        @change="setFontSize"
        @input="setFontSize"
      >
      <div absolute h1 rounded-full bg-primary pointer-events-none :style="{ width: `${(sizes.indexOf(fontSize)) / (sizes.length - 1) * 100}%` }" />
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
    --at-apply: w3 h3 bg-primary -mt-1 outline outline-3 outline-primary rounded-full cursor-pointer appearance-none;
  }

  input[type=range]::-moz-range-track {
    --at-apply: bg-primary-light rounded-full h1;
  }

  input[type=range]:focus::-moz-range-track {
    --at-apply: outline-2 outline-red;
  }

  input[type=range]::-moz-range-thumb {
    --at-apply: w3 h3 bg-primary -mt-1 outline outline-3 outline-primary rounded-full cursor-pointer appearance-none;
  }
</style>
