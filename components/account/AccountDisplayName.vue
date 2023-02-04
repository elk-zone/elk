<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  account: mastodon.v1.Account
}>()

const userSettings = useUserSettings()
</script>

<template>
  <ContentRich
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :show-emojis="!getPreferences(userSettings, 'hideUsernameEmojis')"
    :markdown="false"
  />
</template>
