<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <NuxtLink :to="`/@${account.acct}`">
    {{ getDisplayName(account) }}
  </NuxtLink>
</template>
