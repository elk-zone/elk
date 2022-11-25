<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <div bg-base border="~ base" rounded w-80 z-900 overflow-hidden p-4 class="account-hover-card">
    <AccountInfo :account="account" />
    <div text-sm flex flex-row text-gray mt-4>
      <NuxtLink :to="`/${getAccountHandle(account)}/`">
        {{ account.statusesCount }} Posts
      </NuxtLink>
      <span flex-1 text-center> • </span>
      <NuxtLink :to="`/${getAccountHandle(account)}/following`">
        {{ account.followingCount }} Following
      </NuxtLink>
      <span flex-1 text-center> • </span>
      <NuxtLink :to="`/${getAccountHandle(account)}/followers`">
        {{ account.followersCount }} Followers
      </NuxtLink>
    </div>
    <ContentRichSetup text-4 text-gray :content="account.note" :emojis="account.emojis" />
  </div>
</template>

<style>
.account-hover-card {
  transform-origin: 3em 3em;
}
</style>
