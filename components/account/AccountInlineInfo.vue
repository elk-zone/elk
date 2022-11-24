<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <NuxtLink :href="getAccountPath(account)" flex gap-1 items-center>
    <AccountAvatar :account="account" w-5 h-5 />
    <ContentRich :content="getDisplayName(account)" :emojis="account.emojis" />
  </NuxtLink>
</template>
