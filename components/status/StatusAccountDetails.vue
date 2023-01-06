<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true } = defineProps<{
  account: Account
  link?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="link ? getAccountRoute(account) : undefined"
    flex="~ col" min-w-0 md:flex="~ row gap-2" md:items-center
    text-link-rounded
  >
    <AccountDisplayName :account="account" font-bold line-clamp-1 ws-pre-wrap break-all />
    <AccountHandle :account="account" />
  </NuxtLink>
</template>
