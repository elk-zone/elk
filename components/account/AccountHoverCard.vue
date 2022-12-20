<script setup lang="ts">
import type { Account } from 'masto/fetch'

const { account } = defineProps<{
  account: Account
}>()

const relationship = $(useRelationship(account))
</script>

<template>
  <div v-show="relationship" flex="~ col gap2" rounded min-w-90 max-w-120 z-100 overflow-hidden p-4>
    <div flex="~ gap2" items-center>
      <NuxtLink :to="getAccountRoute(account)" flex-auto rounded-full hover:bg-active transition-100 pr5 mr-a>
        <AccountInfo :account="account" />
      </NuxtLink>
      <AccountFollowButton text-sm :account="account" :relationship="relationship" />
    </div>
    <ContentRich text-4 text-secondary :content="account.note" :emojis="account.emojis" />
    <AccountPostsFollowers text-sm :account="account" />
  </div>
</template>
