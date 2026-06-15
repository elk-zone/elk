<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
}>()

// For local accounts (acct has no `@server` suffix) on the same instance,
// suppress the redundant `@omedia.social` tail. Federated accounts still show the full handle.
const isLocal = computed(() => !account.acct?.includes('@'))
const serverName = computed(() => isLocal.value ? '' : getServerName(account))
</script>

<template>
  <p line-clamp-1 whitespace-pre-wrap break-all text-secondary-light leading-tight dir="ltr">
    <!-- fix: #274 only line-clamp-1 can be used here, using text-ellipsis is not valid -->
    <span text-secondary>{{ getShortHandle(account) }}</span>
    <span v-if="serverName" text-secondary-light>@{{ serverName }}</span>
  </p>
</template>
