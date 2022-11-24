<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true } = defineProps<{
  account: Account
  link?: boolean
}>()

const accountHandle = $(useAccountHandle(account))
</script>

<template>
  <NuxtLink :to="link ? getAccountPath(account) : undefined" flex gap-2 items-center>
    <ContentRich font-bold :content="getDisplayName(account)" :emojis="account.emojis" />
    <p op35 text-sm>
      {{ accountHandle }}
    </p>
  </NuxtLink>
</template>
