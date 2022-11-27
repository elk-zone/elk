<script setup lang="ts">
import type { Account } from 'masto'

const { link = true } = defineProps<{
  account: Account
  link?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="link ? getAccountPath(account) : undefined"
    :class="link ? 'text-link-rounded' : ''"
    min-w-0 flex gap-1 items-center
  >
    <AccountAvatar :account="account" w-5 h-5 />
    <ContentRich :content="getDisplayName(account, { rich: true })" :emojis="account.emojis" />
  </NuxtLink>
</template>
