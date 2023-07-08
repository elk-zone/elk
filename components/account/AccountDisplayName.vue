<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, hideEmojis = false, status } = defineProps<{
  account: mastodon.v1.Account
  hideEmojis?: boolean
  status?: mastodon.v1.Status
}>()

const viewTransitionStyle = computed(() => {
  if (!status)
    return

  const targets = getViewTransitionTargets().value
  if (targets.statusId === status.id && targets.accountId === account.id)
    return { 'view-transition-name': 'account-display-name' }
})
</script>

<template>
  <ContentRich
    :style="viewTransitionStyle"
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :hide-emojis="hideEmojis"
    :markdown="false"
  />
</template>
