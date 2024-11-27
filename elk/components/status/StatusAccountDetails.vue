<script setup lang="ts">
import type { akkoma } from 'akko'

const { account, link = true } = defineProps<{
  account: akkoma.v1.Account
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
    <AccountHandle :account="account" class="zen-none" />
  </NuxtLink>
</template>
