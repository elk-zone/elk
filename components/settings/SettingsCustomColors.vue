<script lang="ts" setup>
import { useCustomColorsRef } from '~/composables/injections'
import { DEFAULT_CUSTOM_COLORS } from '~/constants'

const customColors = useCustomColorsRef()
</script>

<template>
  <div flex="~ col gap-y4">
    <label font-medium flex="~ gap2 items-center">
      <span text-sm>Primary</span>
      <input id="custom-color-primary" v-model="customColors.primary" type="color">
    </label>
    <label font-medium flex="~ gap2 items-center">
      <span text-sm>Text</span>
      <input id="custom-color-text-base" v-model="customColors['text-base']" type="color">
    </label>
    <label font-medium flex="~ gap2 items-center">
      <span text-sm>Base Background</span>
      <input id="custom-color-bg-base" v-model="customColors['bg-base']" type="color">
    </label>
    <label font-medium flex="~ gap2 items-center">
      <span text-sm>Border color</span>
      <input id="custom-color-border" v-model="customColors.border" type="color">
    </label>
    <label font-medium flex="~ gap2 items-center">
      <span text-sm>Darker border color</span>
      <input id="custom-color-border-dark" v-model="customColors['border-dark']" type="color">
    </label>
    <button self-start btn-solid @click="customColors = DEFAULT_CUSTOM_COLORS">
      Reset
    </button>
  </div>
</template>
