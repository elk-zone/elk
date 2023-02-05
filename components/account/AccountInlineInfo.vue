<script setup lang="ts">
import type { mastodon } from 'masto'

const { link = true, avatar = true } = defineProps<{
  account: mastodon.v1.Account
  link?: boolean
  avatar?: boolean
}>()

const userSettings = useUserSettings()
</script>

<template>
  <AccountHoverWrapper :account="account">
    <NuxtLink
      :to="link ? getAccountRoute(account) : undefined"
      :class="link ? 'text-link-rounded -ml-1.8rem pl-1.8rem rtl-(ml0 pl-0.5rem -mr-1.8rem pr-1.8rem)' : ''"
      min-w-0 flex gap-2 items-center
    >
      <AccountAvatar v-if="avatar" :account="account" w-5 h-5 />
      <AccountDisplayName :account="account" :hide-emojis="getPreferences(userSettings, 'hideUsernameEmojis')" line-clamp-1 ws-pre-wrap break-all />
    </NuxtLink>
  </AccountHoverWrapper>
</template>
