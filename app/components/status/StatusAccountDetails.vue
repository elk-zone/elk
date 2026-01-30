<script setup lang="ts">
import type { mastodon } from 'masto'

const { link = true } = defineProps<{
  account: mastodon.v1.Account
  link?: boolean
}>()

const userSettings = useUserSettings()
</script>

<template>
  <NuxtLink
    :to="link ? getAccountRoute(account) : undefined"
    flex="~ col" min-w-0 md:flex="~ row gap-2" md:items-center
    text-link-rounded
  >
    <AccountDisplayName :account="account" :hide-emojis="getPreferences(userSettings, 'hideUsernameEmojis')" font-bold line-clamp-1 ws-pre-wrap break-all />
    <div flex="~ gap-1">
      <AccountHandle :account="account" class="zen-none" />
      <AccountBotIndicator v-if="account.bot" text-xs />
      <AccountLockIndicator v-if="account.locked" text-xs />
    </div>
  </NuxtLink>
</template>
