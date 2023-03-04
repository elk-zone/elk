<script setup lang="ts">
import type { ThemeColors } from '~/composables/settings'

const themes = await import('~/constants/themes.json').then(r => r.default) as [string, ThemeColors][]
const settings = $(useUserSettings())

const currentTheme = $computed(() => settings.themeColors?.['--theme-color-name'] || themes[0][0])

function updateTheme(theme: ThemeColors) {
  settings.themeColors = theme
}
</script>

<template>
  <div flex="~ gap4 wrap" p2>
    <button
      v-for="[key, theme] in themes" :key="key"
      :style="{
        'background': key,
        '--local-ring-color': key,
      }"
      :class="currentTheme === key ? 'ring-2' : 'scale-90'"
      :title="key"
      w-8 h-8 rounded-full transition-all
      ring="$local-ring-color offset-3 offset-$c-bg-base"
      @click="updateTheme(theme)"
    />
  </div>
</template>
