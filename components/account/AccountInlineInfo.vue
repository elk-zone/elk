<script setup lang="ts">
import type { Account } from 'masto'

const { link = true, avatar = true } = defineProps<{
  account: Account
  link?: boolean
  avatar?: boolean
}>()
</script>

<template>
  <AccountHoverWrapper :account="account">
    <NuxtLink
      :to="link ? getAccountRoute(account) : undefined"
      :class="link ? 'text-link-rounded ml-0 pl-0' : ''"
      min-w-0 flex gap-1 items-center
    >
      <AccountAvatar v-if="avatar" :account="account" w-5 h-5 />
      <ContentRich ws-nowrap :content="getDisplayName(account, { rich: true })" :emojis="account.emojis" />
    </NuxtLink>
  </AccountHoverWrapper>
</template>
