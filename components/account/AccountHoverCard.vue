<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
}>()

const relationship = useRelationship(account)
</script>

<template>
  <div v-show="relationship" flex="~ col gap2" rounded min-w-90 max-w-120 z-100 overflow-hidden p-4>
    <div flex="~ gap2" items-center>
      <NuxtLink :to="getAccountRoute(account)" flex-auto rounded-full hover:bg-active transition-100 pe5 me-a>
        <AccountInfo :account="account" :hover-card="true" />
      </NuxtLink>
      <AccountFollowButton text-sm :account="account" :relationship="relationship" />
    </div>
    <div v-if="account.note" max-h-100 overflow-y-auto>
      <ContentRich text-4 text-secondary :content="account.note" :emojis="account.emojis" />
    </div>
    <AccountPostsFollowers text-sm :account="account" :is-hover-card="true" />
  </div>
</template>
