<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <div flex gap-5>
    <NuxtLink :to="getAccountPath(account)" exact-active-class="text-primary">
      <span font-bold>{{ formattedNumber(account.statusesCount) }}</span> <span text-secondary>Posts</span>
    </NuxtLink>
    <NuxtLink :to="`${getAccountPath(account)}/following`" exact-active-class="text-primary">
      <span font-bold>{{ humanReadableNumber(account.followingCount) }}</span> <span text-secondary>Following</span>
    </NuxtLink>
    <NuxtLink :to="`${getAccountPath(account)}/followers`" exact-active-class="text-primary">
      <span font-bold>{{ humanReadableNumber(account.followersCount) }}</span> <span text-secondary>Followers</span>
    </NuxtLink>
  </div>
</template>
