<script lang="ts" setup>
import type { FontSize } from '~/composables/fontSize'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as FontSize[]
const fontSize = getFontSize()
</script>

<template>
  <CommonDropdown>
    <slot />

    <template #popper>
      <CommonDropdownItem
        v-for="size in sizes"
        :key="size"
        :checked="size === fontSize"
        @click="fontSize = size"
      >
        {{ size }}
      </CommonDropdownItem>
    </template>
  </CommonDropdown>
</template>
