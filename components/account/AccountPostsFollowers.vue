<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  account: mastodon.v1.Account
}>()
const { formatHumanReadableNumber, formatNumber, forSR } = useHumanReadableNumber()

const statusesCount = $computed(() => formatHumanReadableNumber(props.account.statusesCount))
const statusesCountSR = $computed(() => forSR(props.account.statusesCount))
const followingCount = $computed(() => formatHumanReadableNumber(props.account.followingCount))
const followingCountSR = $computed(() => forSR(props.account.followingCount))
const followersCount = $computed(() => formatHumanReadableNumber(props.account.followersCount))
const followersCountSR = $computed(() => forSR(props.account.followersCount))
</script>

<template>
  <div flex gap-5>
    <NuxtLink
      :to="getAccountRoute(account)"
      replace
      text-secondary
      exact-active-class="text-primary"
      :class="statusesCountSR ? 'flex gap-x-1' : null"
    >
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.posts_count" :plural="account.statusesCount">
          <CommonTooltip v-if="statusesCountSR" :content="formatNumber(account.statusesCount)" placement="bottom">
            <span aria-hidden="true" font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ statusesCount }}</span>
            <span sr-only font-bold>{{ formatNumber(account.statusesCount) }}</span>
          </CommonTooltip>
          <span v-else font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ statusesCount }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
    <NuxtLink
      :to="getAccountFollowingRoute(account)"
      replace
      text-secondary exact-active-class="text-primary"
      :class="followingCountSR ? 'flex gap-x-1' : null"
    >
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.following_count" :plural="account.followingCount">
          <CommonTooltip v-if="followingCountSR" :content="formatNumber(account.followingCount)" placement="bottom">
            <span aria-hidden="true" font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followingCount }}</span>
            <span sr-only font-bold>{{ formatNumber(account.followingCount) }}</span>
          </CommonTooltip>
          <span v-else font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followingCount }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
    <NuxtLink
      :to="getAccountFollowersRoute(account)"
      replace
      text-secondary exact-active-class="text-primary"
      :class="followersCountSR ? 'flex gap-x-1' : null"
    >
      <template #default="{ isExactActive }">
        <i18n-t keypath="account.followers_count" :plural="account.followersCount">
          <CommonTooltip v-if="followersCountSR" :content="formatNumber(account.followersCount)" placement="bottom">
            <span aria-hidden="true" font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followersCount }}</span>
            <span sr-only font-bold>{{ formatNumber(account.followersCount) }}</span>
          </CommonTooltip>
          <span v-else font-bold :class="isExactActive ? 'text-primary' : 'text-base'">{{ followersCount }}</span>
        </i18n-t>
      </template>
    </NuxtLink>
  </div>
</template>
