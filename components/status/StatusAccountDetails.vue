<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true } = defineProps<{
  account: Account
  link?: boolean
}>()

const accountHandle = $(useAccountHandle(account))
</script>

<template>
  <NuxtLink
    :to="link ? getAccountPath(account) : undefined"
    flex="col 1" min-w-0 md:flex="~ gap-2" md:items-center
  >
    <ContentRichSetup font-bold break-words :content="getDisplayName(account)" :emojis="account.emojis" />
    <p op35 text-sm>
      {{ accountHandle }}
    </p>
  </NuxtLink>
</template>
