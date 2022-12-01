<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const serverName = $computed(() => getServerName(account))
</script>

<template>
  <p line-clamp-1 whitespace-pre-wrap break-all text-secondary-light>
    <span text-secondary>{{ getShortHandle(account) }}</span>
    <span v-if="serverName" text-secondary-light>@{{ serverName }}</span>
  </p>
</template>
