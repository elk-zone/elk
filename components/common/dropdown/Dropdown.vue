<script setup lang="ts">
import { dropdownContextKey } from './ctx'

const dropdown = $ref<any>()

provide(dropdownContextKey, {
  hide: () => dropdown.hide(),
})
</script>

<template>
  <VDropdown v-bind="$attrs" ref="dropdown">
    <slot />
    <template #popper="scope">
      <slot name="popper" v-bind="scope" />
    </template>
  </VDropdown>
</template>
