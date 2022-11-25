<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true } = defineProps<{
  account: Account
  link?: boolean
}>()

const accountHandle = $(useAccountHandle(account))
</script>

<template>
  <NuxtLink :to="link ? getAccountPath(account) : undefined" flex="~ row wrap" gap-x-2 items-center>
    <ContentRichSetup font-bold :content="getDisplayName(account)" :emojis="account.emojis" />
    <p op35 text-sm>
      {{ accountHandle }}
    </p>
  </NuxtLink>
</template>
