<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <NuxtLink :to="getAccountPath(account)">
    <ContentRich font-bold :content="getDisplayName(account, { rich: true })" :emojis="account.emojis" />
  </NuxtLink>
</template>
