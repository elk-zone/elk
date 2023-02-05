<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  account: mastodon.v1.Account
  useShowEmojisPreference?: boolean
}>()

const userSettings = useUserSettings()
</script>

<template>
  <ContentRich
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :show-emojis="!useShowEmojisPreference || !getPreferences(userSettings, 'hideUsernameEmojis')"
    :markdown="false"
  />
</template>
