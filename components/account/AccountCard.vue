<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

cacheAccount(account)
</script>

<template>
  <div flex justify-between hover:bg-active transition-100>
    <AccountInfo :account="account" p1 />
    <div h-full p1>
      <AccountFollowButton :account="account" />
    </div>
  </div>
</template>
