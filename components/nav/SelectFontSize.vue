<script lang="ts" setup>
import { FontSize } from 'composables/fontSize'
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <CommonDropdown>
    <slot />

    <template #popper>
      <CommonDropdownItem
        v-for="size in sizes"
        :key="size"
        :checked="size === fontSize"
        @click="setFontSize(size as FontSize)"
      >
        {{ size }}
      </CommonDropdownItem>
    </template>
  </CommonDropdown>
</template>
