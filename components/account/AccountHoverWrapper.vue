<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
  disabled?: boolean
}>()
</script>

<template>
  <VMenu v-if="!disabled" placement="bottom-start" :delay="{ show: 500, hide: 100 }">
    <slot />
    <template #popper>
      <AccountHoverCard :account="account" />
    </template>
  </VMenu>
  <slot v-else />
</template>
