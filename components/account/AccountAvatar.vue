<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <img :src="account.avatar" :alt="account.username" rounded bg-gray:10>
</template>
