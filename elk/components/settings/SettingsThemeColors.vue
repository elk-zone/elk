<script setup lang="ts">
import type { ThemeColors } from '~/composables/settings'
import { THEME_COLORS } from '~/constants'

const { config } = useFrontendConfig()

const { data: constantThemes }: { data: Ref<[string, ThemeColors][]> } = useAsyncData(
  'theme-retrieve',
  () => import('~/constants/themes.json').then(p => p.default as [string, ThemeColors][]),
)

const themes = computed(() => {
  if (!config.value || !constantThemes.value)
    return undefined
  const map = new Map<'dark' | 'light', [string, ThemeColors][]>([['dark', []], ['light', []]])
  const themes = [
    config.value?.theme,
    ...constantThemes.value,
  ].filter(k => !!k)
  for (const [key, theme] of themes) {
    map.get('dark')!.push([key, theme])
    map.get('light')!.push([key, {
      ...theme,
      '--c-primary': `color-mix(in srgb, ${theme['--c-primary']}, black 25%)`,
    }])
  }
  return map
})

const settings = useUserSettings()

const media = useMediaQuery('(prefers-color-scheme: dark)')

const colorMode = useColorMode()

const useThemes = shallowRef<[string, ThemeColors][]>([])

function refreshThemes() {
  if (!themes.value)
    return
  const dark = colorMode.preference === 'dark' || (colorMode.preference === 'system' && media.value)
  const newThemes = dark ? themes.value.get('dark')! : themes.value.get('light')!
  const key = settings.value.themeColors?.['--theme-color-name'] || THEME_COLORS.defaultTheme
  for (const [k, theme] of newThemes) {
    if (k === key) {
      settings.value.themeColors = theme
      break
    }
  }
  useThemes.value = newThemes
}

watch(() => colorMode.preference, refreshThemes, { immediate: true, flush: 'post' })
watch(themes, refreshThemes, { immediate: true, flush: 'post' })

const currentTheme = computed(() => settings.value.themeColors?.['--theme-color-name'] || THEME_COLORS.defaultTheme)

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
        v-for="[key, theme] in useThemes" :key="key"
        :style="{
          '--rgb-primary': theme['--rgb-primary'],
          'background': theme['--c-primary'],
          '--local-ring-color': theme['--c-primary'],
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
