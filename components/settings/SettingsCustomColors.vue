<script lang="ts" setup>
import { useCustomColorsRef } from '~/composables/injections'
import type { CustomColors } from '~/types'

const customColors = useCustomColorsRef()
</script>

<template>
  <input v-model="customColors.primary" type="color">
</template>
