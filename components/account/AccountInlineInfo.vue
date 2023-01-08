<script setup lang="ts">
import type { mastodon } from 'masto'

const { link = true, avatar = true } = defineProps<{
  account: mastodon.v1.Account
  link?: boolean
  avatar?: boolean
}>()
</script>

<template>
  <AccountHoverWrapper :account="account">
    <NuxtLink
      :to="link ? getAccountRoute(account) : undefined"
      :class="link ? 'text-link-rounded ms-0 ps-0' : ''"
      min-w-0 flex gap-2 items-center
    >
      <AccountAvatar v-if="avatar" :account="account" w-5 h-5 />
      <AccountDisplayName :account="account" line-clamp-1 ws-pre-wrap break-all />
    </NuxtLink>
  </AccountHoverWrapper>
</template>
