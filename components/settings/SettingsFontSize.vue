<script lang="ts" setup>
import { DEFAULT_FONT_SIZE } from '~/constants'
import type { FontSize } from '~/composables/settings'

const userSettings = useUserSettings()

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as FontSize[]
</script>

<template>
  <select v-model="userSettings.fontSize">
    <option v-for="size in sizes" :key="size" :value="size" :selected="userSettings.fontSize === size">
      {{ `${$t(`settings.interface.size_label.${size}`)}${size === DEFAULT_FONT_SIZE ? $t('settings.interface.default') : ''}` }}
    </option>
  </select>
</template>
