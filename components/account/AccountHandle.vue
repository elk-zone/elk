<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, status } = defineProps<{
  account: mastodon.v1.Account
  status?: mastodon.v1.Status
}>()
const serverName = $computed(() => getServerName(account))

const viewTransitionStyle = computed(() => {
  if (!status)
    return

  const targets = getViewTransitionTargets().value
  if (targets.statusId === status.id && targets.accountId === account.id)
    return { 'view-transition-name': 'account-handle' }
})
</script>

<template>
  <p :style="viewTransitionStyle" line-clamp-1 whitespace-pre-wrap break-all text-secondary-light leading-tight dir="ltr">
    <!-- fix: #274 only line-clamp-1 can be used here, using text-ellipsis is not valid -->
    <span text-secondary>{{ getShortHandle(account) }}</span>
    <span v-if="serverName" text-secondary-light>@{{ serverName }}</span>
  </p>
</template>
