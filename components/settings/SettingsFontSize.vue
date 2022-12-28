<script lang="ts" setup>
import type { FontSize } from '~/types'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as FontSize[]
const fontSize = useFontSizeRef()
</script>

<template>
  <select v-model="fontSize">
    <option v-for="size in sizes" :key="size" :value="size" :selected="fontSize === size">
      {{ size }}
    </option>
  </select>
</template>
