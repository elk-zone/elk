<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, hideEmojis = false } = defineProps<{
  account: mastodon.v1.Account
  hideEmojis?: boolean
}>()

const viewTransitionStype = getViewTransitionStyles('account-display-name', { account })
</script>

<template>
  <ContentRich
    :style="viewTransitionStype"
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :hide-emojis="hideEmojis"
    :markdown="false"
  />
</template>
