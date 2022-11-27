<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <VMenu placement="bottom-start">
    <slot />
    <template #popper>
      <AccountHoverCard :account="account" />
    </template>
  </VMenu>
</template>
