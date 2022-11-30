<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <div flex gap-5>
    <NuxtLink :to="getAccountRoute(account)" text-secondary exact-active-class="text-primary">
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.posts_count">
          <span font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ formattedNumber(account.statusesCount) }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
    <NuxtLink :to="getAccountFollowingRoute(account)" text-secondary exact-active-class="text-primary">
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.following_count">
          <span font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ humanReadableNumber(account.followingCount) }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
    <NuxtLink :to="getAccountFollowersRoute(account)" text-secondary exact-active-class="text-primary">
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.followers_count">
          <span font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ humanReadableNumber(account.followersCount) }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
  </div>
</template>
