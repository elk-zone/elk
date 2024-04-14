<script setup lang="ts">
import type { ThemeColors } from '~/composables/settings'

const themes = await import('~/constants/themes.json').then(r => r.default) as [string, ThemeColors][]
const settings = useUserSettings()

const currentTheme = computed(() => settings.value.themeColors?.['--theme-color-name'] || themes[0][1]['--theme-color-name'])

function updateTheme(theme: ThemeColors) {
  settings.value.themeColors = theme
}
</script>

<template>
  <section space-y-2>
    <h2 id="interface-tc" font-medium>
      {{ $t('settings.interface.theme_color') }}
    </h2>
    <div flex="~ gap4 wrap" p2 role="group" aria-labelledby="interface-tc">
      <button
        v-for="[key, theme] in themes" :key="key"
        :style="{
          'background': key,
          '--local-ring-color': key,
        }"
        type="button"
        :class="currentTheme === theme['--theme-color-name'] ? 'ring-2' : 'scale-90'"
        :aria-pressed="currentTheme === theme['--theme-color-name'] ? 'true' : 'false'"
        :title="theme['--theme-color-name']"
        w-8 h-8 rounded-full transition-all
        ring="$local-ring-color offset-3 offset-$c-bg-base"
        @click="updateTheme(theme)"
      />
    </div>
  </section>
</template>
