<script setup lang="tsx">
import { getThemeColors } from '~~/scripts/generate-themes'

const isLoading = ref(false)

const { config, update } = useFrontendConfig('pleroma-config-theme')

function rgbToHex(rgb: string) {
  const result = /^(\d{1,3}), (\d{1,3}), (\d{1,3})$/.exec(rgb)
  if (!result)
    return null
  return `#${(1 << 24 | Number.parseInt(result[1], 10) << 16 | Number.parseInt(result[2], 10) << 8 | Number.parseInt(result[3], 10)).toString(16).slice(1)}`
}

// function hexToRgb(hex: string) {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
//   return result
//     ? {
//         r: Number.parseInt(result[1], 16),
//         g: Number.parseInt(result[2], 16),
//         b: Number.parseInt(result[3], 16),
//       }
//     : null
// }

function convert(theme: ThemeColors | undefined) {
  if (!theme)
    return theme
  return {
    ...theme,
    '--rgb-primary': rgbToHex(theme['--rgb-primary']) || theme['--rgb-primary'],
    '--rgb-dark-primary': rgbToHex(theme['--rgb-dark-primary']) || theme['--rgb-dark-primary'],
  }
}

const theme: Ref<Partial<ThemeColors>> = ref(convert(config.value?.theme?.[1]) || {})

watch(config, () => {
  if (config.value)
    theme.value = convert(config.value?.theme?.[1]) || {}
})

async function save(e: Event) {
  if (!config.value)
    return
  const data = new FormData(e.target as HTMLFormElement)
  // others colors do not seem to be usefull for now but let's keep everything there
  // and copy values for now
  // let theme = data.keys().reduce((acc, curr) => {
  //   return {
  //     ...acc,
  //     [curr]: data.get(curr),
  //   }
  // }, {}) as ThemeColors
  // const themeName = theme['--rgb-primary']
  // theme['--theme-color-name'] = themeName
  // const rgb = hexToRgb(theme['--rgb-primary']) as { r: number, g: number, b: number }
  // theme['--rgb-primary'] = `${rgb.r}, ${rgb?.g}, ${rgb?.b}`
  // theme['--c-primary'] = 'rgb(var(--rgb-primary))'
  // const rgbDark = hexToRgb(theme['--rgb-dark-primary']) as { r: number, g: number, b: number }
  // theme['--rgb-dark-primary'] = `${rgbDark.r}, ${rgbDark?.g}, ${rgbDark?.b}`
  // theme['--c-dark-primary'] = 'rgb(var(--rgb-dark-primary))'
  const theme = getThemeColors(data.get('--rgb-primary') as string)
  const themeName = data.get('--rgb-primary') as string

  update({ ...config.value, theme: [themeName, theme] }, isLoading)
}

function remove() {
  if (!config.value)
    return
  update({ ...config.value, theme: undefined }, isLoading)
}
</script>

<template>
  <form space-y-3 @submit.prevent="save">
    <h2 id="interface-tc" font-medium>
      {{ $t('settings.interface.theme_color') }}
    </h2>
    <p my-2>
      {{ $t('admin.theme.description') }}
    </p>
    <div flex justify-between gap-4>
      <div flex flex-col gap-2 grow>
        <h3 flex gap-1 items-center>
          <div i-ri:sun-line /> {{ $t('admin.theme.light-mode') }}
        </h3>
        <label>
          <!-- {{ $t('admin.theme.primary') }} -->
          <CommonColorPicker v-model="theme['--rgb-primary']" mt-1 required name="--rgb-primary" />
        </label>
        <!-- <label>
          {{ $t('admin.theme.active') }}
          <CommonColorPicker v-model="theme['--c-primary-active']" mt-1 required name="--c-primary-active" />
        </label>
        <label>
          {{ $t('admin.theme.light') }}
          <CommonColorPicker v-model="theme['--c-primary-light']" mt-1 required name="--c-primary-light" />
        </label>
        <label>
          {{ $t('admin.theme.fade') }}
          <CommonColorPicker v-model="theme['--c-primary-fade']" mt-1 required name="--c-primary-fade" />
        </label> -->
      </div>
      <!-- <div flex flex-col gap-2 grow>
        <h3 flex gap-1 items-center>
          <div i-ri:moon-line /> {{ $t('admin.theme.dark-mode') }}
        </h3>
        <label>
          {{ $t('admin.theme.primary') }}
          <CommonColorPicker v-model="theme['--rgb-dark-primary']" mt-1 required name="--rgb-dark-primary" />
        </label>
        <label>
          {{ $t('admin.theme.active') }}
          <CommonColorPicker v-model="theme['--c-dark-primary-active']" mt-1 required name="--c-dark-primary-active" />
        </label>
        <label>
          {{ $t('admin.theme.light') }}
          <CommonColorPicker v-model="theme['--c-dark-primary-light']" mt-1 required name="--c-dark-primary-light" />
        </label>
        <label>
          {{ $t('admin.theme.fade') }}
          <CommonColorPicker v-model="theme['--c-dark-primary-fade']" mt-1 required name="--c-dark-primary-fade" />
        </label>
      </div> -->
    </div>
    <div flex gap-3 justify-end>
      <button
        btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
        type="button"
        :disabled="isLoading"
        :class="isLoading ? 'border-none' : undefined"
        @click="remove()"
      >
        <span v-if="!isLoading" aria-hidden="true" class="block i-ri:delete-bin-line" />
        <span v-else i-ri:loader-4-line animate-spin />
        {{ $t('action.clear') }}
      </button>
      <button
        btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
        type="submit"
        :disabled="isLoading"
        :class="isLoading ? 'border-none' : undefined"
      >
        <span v-if="!isLoading" aria-hidden="true" class="block i-ri:save-2-line" />
        <span v-else i-ri:loader-4-line animate-spin />
        {{ $t('action.save') }}
      </button>
    </div>
  </form>
</template>
