<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const serverName = $computed(() => getServerName(account))
</script>

<template>
  <p ws-nowrap text-ellipsis of-hidden text-secondary-light>
    <span text-secondary>{{ getShortHandle(account) }}</span>
    <span v-if="serverName" text-secondary-light>@{{ serverName }}</span>
  </p>
</template>
