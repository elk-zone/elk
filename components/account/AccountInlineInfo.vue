<script setup lang="ts">
import type { mastodon } from 'masto'

const { link = true, avatar = true, account } = defineProps<{
  account?: mastodon.v1.Account
  link?: boolean
  avatar?: boolean
}>()

const userSettings = useUserSettings()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template v-if="account">
  <template v-if="currentUser">
    <AccountHoverWrapper :account="account" :disabled="!currentUser">
      <NuxtLink
        :to="link && account ? getAccountRoute(account) : undefined"
        :class="link ? 'text-link-rounded -ml-1.5rem pl-1.5rem rtl-(ml0 pl-0.5rem -mr-1.5rem pr-1.5rem)' : ''"
        v-bind="$attrs"
        min-w-0 flex gap-2 items-center
      >
        <AccountAvatar v-if="account && avatar" :account="account" w-5 h-5 />
        <AccountDisplayName v-if="account" :account="account" :hide-emojis="getPreferences(userSettings, 'hideUsernameEmojis')" line-clamp-1 ws-pre-wrap break-all />
      </NuxtLink>
    </AccountHoverWrapper>
  </template>
  <template v-else>
    <NuxtLink
      :to="undefined"
      :class="link ? 'text-link-rounded -ml-1.5rem pl-1.5rem rtl-(ml0 pl-0.5rem -mr-1.5rem pr-1.5rem)' : ''"
      min-w-0 flex gap-2 items-center
      @click.prevent="checkLogin()"
    >
      <AccountAvatar v-if="account && avatar" :account="account" w-5 h-5 />
      <AccountDisplayName v-if="account" :account="account" :hide-emojis="getPreferences(userSettings, 'hideUsernameEmojis')" line-clamp-1 ws-pre-wrap break-all />
    </NuxtLink>
  </template>
</template>
