<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  account: mastodon.v1.Account
}>()

const userSettings = useUserSettings()
</script>

<template>
  <div flex gap-5>
    <NuxtLink
      :to="getAccountRoute(account)"
      replace
      text-secondary
      exact-active-class="text-primary"
    >
      <template #default="{ isExactActive }">
        <CommonLocalizedNumber
          keypath="account.posts_count"
          :count="account.statusesCount"
          font-bold
          :class="isExactActive ? 'text-primary' : 'text-base'"
        />
      </template>
    </NuxtLink>
    <NuxtLink
      v-if="!getPreferences(userSettings, 'hideFollowerCount')"
      :to="getAccountFollowingRoute(account)"
      replace
      text-secondary exact-active-class="text-primary"
    >
      <template #default="{ isExactActive }">
        <CommonLocalizedNumber
          keypath="account.following_count"
          :count="account.followingCount"
          font-bold
          :class="isExactActive ? 'text-primary' : 'text-base'"
        />
      </template>
    </NuxtLink>
    <NuxtLink
      v-if="!getPreferences(userSettings, 'hideFollowerCount')"
      :to="getAccountFollowersRoute(account)"
      replace text-secondary
      exact-active-class="text-primary"
    >
      <template #default="{ isExactActive }">
        <CommonLocalizedNumber
          keypath="account.followers_count"
          :count="account.followersCount"
          font-bold
          :class="isExactActive ? 'text-primary' : 'text-base'"
        />
      </template>
    </NuxtLink>
  </div>
</template>
