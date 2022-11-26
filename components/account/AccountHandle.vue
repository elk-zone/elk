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
    <span v-if="serverName" text="gray/95">@{{ serverName }}</span>
  </p>
</template>
