<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const serverName = $computed(() => getServerName(account))
</script>

<template>
  <p>
    <span>{{ getShortHandle(account) }}</span>
    <span v-if="serverName" text-xs ml1>@{{ serverName }}</span>
  </p>
</template>
