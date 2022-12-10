<script setup lang="ts">
import type { Account } from 'masto'

const props = defineProps<{
  account: Account
}>()

const account = $computed(() => props.account)

const serverName = $computed(() =>
  'displayServerName' in account
    ? account.displayServerName
    : getServerName(account),
)
</script>

<template>
  <p line-clamp-1 whitespace-pre-wrap break-all text-secondary-light>
    <!-- fix: #274 only line-clamp-1 can be used here, using text-ellipsis is not valid -->
    <span text-secondary>{{ getShortHandle(account) }}</span>
    <span v-if="serverName" text-secondary-light>@{{ serverName }}</span>
  </p>
</template>
