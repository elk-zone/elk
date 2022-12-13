<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()

const loaded = $ref(false)
const error = $ref(false)
</script>

<template>
  <img
    :key="account.avatar"
    :src="error ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : account.avatar"
    :alt="$t('account.avatar_description', [account.username])"
    loading="lazy"
    rounded-full
    :class="loaded ? 'bg-base' : 'bg-gray:10'"
    v-bind="$attrs"
    @load="loaded = true"
    @error="error = true"
  >
</template>
