<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()

const loaded = $ref(false)
</script>

<template>
  <img
    :key="account.avatar"
    :src="account.avatar"
    :alt="account.username"
    loading="lazy"
    rounded-full
    :class="loaded ? 'bg-gray' : 'bg-gray:10'"
    v-bind="$attrs"
    @load="loaded = true"
  >
</template>
