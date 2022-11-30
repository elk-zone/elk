<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
  hoverCard?: boolean
}>()

cacheAccount(account)
</script>

<template>
  <div flex justify-between hover:bg-active transition-100>
    <AccountInfo
      :account="account" hover p1 as="router-link"
      :hover-card="hoverCard"
      shrink
      overflow-hidden
      :to="getAccountRoute(account)"
    />
    <div h-full p1 shrink-0>
      <AccountFollowButton :account="account" />
    </div>
  </div>
</template>
