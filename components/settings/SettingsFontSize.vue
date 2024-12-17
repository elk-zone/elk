<script setup lang="ts">
import type { FontSize } from '~/composables/settings'
import { DEFAULT_FONT_SIZE } from '~/constants'

const userSettings = useUserSettings()

const sizes = (Array.from({ length: 11 })).fill(0).map((x, i) => `${10 + i}px`) as FontSize[]

function setFontSize(e: Event) {
  if (e.target && 'valueAsNumber' in e.target)
    userSettings.value.fontSize = sizes[e.target.valueAsNumber as number]
}
</script>

<template>
  <section space-y-2>
    <h2 id="interface-fs" font-medium>
      {{ $t('settings.interface.font_size') }}
    </h2>
    <div flex items-center space-x-4 select-settings>
      <span text-xs text-secondary>Aa</span>
      <div flex-1 relative flex items-center>
        <input
          aria-labelledby="interface-fs"
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
        <div flex items-center justify-between absolute w-full pointer-events-none>
          <div
            v-for="i in sizes.length" :key="i"
            class="container-marker"
            h-3 w-3
            rounded-full bg-secondary-light
            relative
          >
            <div
              v-if="(sizes.indexOf(userSettings.fontSize)) === i - 1"
              absolute rounded-full class="-top-1 -left-1"
              bg-primary h-5 w-5
            />
          </div>
        </div>
      </div>
      <span text-xl text-secondary>Aa</span>
    </div>
  </section>
</template>

<style>
  input:focus + div .container-marker:has(> div)::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2rem;
    height: 2rem;
    border: 2px solid var(--c-primary);
    border-radius: 50%;
  }
  input[type=range]::-webkit-slider-runnable-track {
    --at-apply: bg-secondary-light rounded-full h1 op60;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    --at-apply: outline-2 outline-red;
  }
  input[type=range]::-webkit-slider-thumb {
    --at-apply: w3 h3 bg-primary -mt-1 outline outline-3 outline-primary rounded-full cursor-pointer appearance-none;
  }
  input[type=range]::-moz-range-track {
    --at-apply: bg-secondary-light rounded-full h1 op60;
  }
  input[type=range]:focus::-moz-range-track {
    --at-apply: outline-2 outline-red;
  }
  input[type=range]::-moz-range-thumb {
    --at-apply: w3 h3 bg-primary -mt-1 outline outline-3 outline-primary rounded-full cursor-pointer appearance-none border-none;
  }
</style>
