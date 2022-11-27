<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <img
    :key="account.avatar"
    :src="account.avatar"
    :alt="account.username"
    loading="lazy"
    rounded-full bg-gray:10
    v-bind="$attrs"
  >
</template>
