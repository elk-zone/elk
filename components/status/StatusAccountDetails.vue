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
    flex="~ col" min-w-0 md:flex="~ row gap-2" md:items-center
  >
    <ContentRich font-bold break-words hover:underline :content="getDisplayName(account)" :emojis="account.emojis" />
    <p op35 text-sm>
      {{ accountHandle }}
    </p>
  </NuxtLink>
</template>
