<script setup lang="ts">
import type { Account } from 'masto'

const props = defineProps<{
  account: Account
}>()
const { formatHumanReadableNumber, formatNumber, forSR } = useHumanReadableNumber()

const statusesCount = $computed(() => formatNumber(props.account.statusesCount))
const followingCount = $computed(() => formatHumanReadableNumber(props.account.followingCount))
const followingCountSR = $computed(() => forSR(props.account.followingCount))
const followersCount = $computed(() => formatHumanReadableNumber(props.account.followersCount))
const followersCountSR = $computed(() => forSR(props.account.followersCount))
</script>

<template>
  <div flex gap-5>
    <NuxtLink :to="getAccountRoute(account)" text-secondary exact-active-class="text-primary">
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.posts_count" :plural="account.statusesCount">
          <span font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ statusesCount }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
    <NuxtLink :to="getAccountFollowingRoute(account)" text-secondary exact-active-class="text-primary">
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.following_count">
          <span v-if="followingCountSR">
            <span aria-hidden="true" font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followingCount }}</span>
            <span sr-only font-bold>{{ account.followingCount }}</span>
          </span>
          <span v-else font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followingCount }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
    <NuxtLink :to="getAccountFollowersRoute(account)" text-secondary exact-active-class="text-primary">
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.followers_count" :plural="account.followersCount">
          <span v-if="followersCountSR">
            <span aria-hidden="true" font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followersCount }}</span>
            <span sr-only font-bold>{{ account.followersCount }}</span>
          </span>
          <span v-else font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followersCount }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
  </div>
</template>
