<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <NuxtLink :href="`/@${account.acct}`" flex gap-2 font-bold items-center>
    <img :src="account.avatar" class="w-5 h-5 rounded">
    <CommonRichContent :content="getDisplayName(account)" />
  </NuxtLink>
</template>
