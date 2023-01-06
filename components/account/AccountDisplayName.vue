<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <ContentRich
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :markdown="false"
  />
</template>
