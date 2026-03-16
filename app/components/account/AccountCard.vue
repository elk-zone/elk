<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
  hoverCard?: boolean
  relationshipContext?: 'followedBy' | 'following'
}>()

cacheAccount(account)
</script>

<template>
  <div flex justify-between hover:bg-active transition-100>
    <AccountInfo
      :account="account" hover p1 as="router-link"
      :hover-card="hoverCard"
      shrink
      overflow-hidden
      :to="getAccountRoute(account)"
    />
    <slot>
      <div h-full p1 shrink-0>
        <AccountFollowButton :account="account" :context="relationshipContext" />
      </div>
    </slot>
  </div>
</template>
