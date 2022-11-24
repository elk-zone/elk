<script setup lang="ts">
import type { Account } from 'masto'

const { link = true } = defineProps<{
  account: Account
  link?: boolean
}>()
</script>

<template>
  <NuxtLink :to="link ? getAccountPath(account) : undefined" flex gap-1 items-center>
    <AccountAvatar :account="account" w-5 h-5 />
    <ContentRich :content="getDisplayName(account)" :emojis="account.emojis" />
  </NuxtLink>
</template>
