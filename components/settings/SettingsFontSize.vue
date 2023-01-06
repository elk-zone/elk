<script lang="ts" setup>
import { DEFAULT_FONT_SIZE } from '~/constants'
import type { FontSize } from '~/types'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as FontSize[]
const fontSize = useFontSizeRef()
</script>

<template>
  <select v-model="fontSize">
    <option v-for="size in sizes" :key="size" :value="size" :selected="fontSize === size">
      {{ `${$t(`settings.interface.size_label.${size}`)}${size === DEFAULT_FONT_SIZE ? $t('settings.interface.default') : ''}` }}
    </option>
  </select>
</template>
