<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <NuxtLink :to="getAccountPath(account)">
    {{ getDisplayName(account) }}
  </NuxtLink>
</template>
