<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, hideEmojis = false } = defineProps<{
  account: mastodon.v1.Account
  hideEmojis?: boolean
}>()

const viewTransitionStyle = getViewTransitionStyles('account-display-name', { account })
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
