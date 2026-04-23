<script setup lang="ts">
import type { mastodon } from 'masto'

const { hideEmojis = false } = defineProps<{
  account: mastodon.v1.Account
  hideEmojis?: boolean
}>()
</script>

<template>
  <ContentRich
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :hide-emojis="hideEmojis"
    :markdown="false"
  />
</template>
