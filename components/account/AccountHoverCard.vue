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
      <NuxtLink :to="`/${getFullHandle(account)}/`">
        {{ formattedNumber(account.statusesCount) }} Posts
      </NuxtLink>
      <span flex-1 text-center> • </span>
      <NuxtLink :to="`/${getFullHandle(account)}/following`">
        {{ humanReadableNumber(account.followingCount) }} Following
      </NuxtLink>
      <span flex-1 text-center> • </span>
      <NuxtLink :to="`/${getFullHandle(account)}/followers`">
        {{ humanReadableNumber(account.followersCount) }} Followers
      </NuxtLink>
    </div>
    <ContentRich text-4 text-gray :content="account.note" :emojis="account.emojis" />
  </div>
</template>
