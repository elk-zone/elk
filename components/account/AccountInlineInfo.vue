<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <NuxtLink :href="`/@${account.acct}`" flex gap-2 items-center>
    <AccountAvatar :account="account" w-5 h-5 />
    <CommonRichContent :content="getDisplayName(account)" :emojis="account.emojis" />
  </NuxtLink>
</template>
