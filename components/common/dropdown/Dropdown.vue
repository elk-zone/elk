<script setup lang="ts">
import { dropdownContextKey } from './ctx'
defineProps<{
  placement?: string
}>()

const dropdown = $ref<any>()

provide(dropdownContextKey, {
  hide: () => dropdown.hide(),
})
</script>

<template>
  <VDropdown v-bind="$attrs" ref="dropdown" :class="{ dark: isDark }" :placement="placement || 'auto'">
    <slot />
    <template #popper="scope">
      <slot name="popper" v-bind="scope" />
    </template>
  </VDropdown>
</template>
