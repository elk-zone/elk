<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
  square?: boolean
}>()

const loaded = $ref(false)
const error = $ref(false)
</script>

<template>
  <img
    :key="account.avatar"
    width="400"
    height="400"
    :src="error ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : account.avatar"
    :alt="$t('account.avatar_description', [account.username])"
    loading="lazy"
    :class="(loaded ? 'bg-base' : 'bg-gray:10') + (square ? ' rounded-3' : ' rounded-full')"
    v-bind="$attrs"
    @load="loaded = true"
    @error="error = true"
  >
</template>
