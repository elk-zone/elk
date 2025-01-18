<script setup lang="ts">
import type { mastodon } from 'masto'

defineOptions({
  inheritAttrs: false,
})

const { account, as = 'div' } = defineProps<{
  account: mastodon.v1.Account
  as?: string
}>()

cacheAccount(account)
</script>

<template>
  <component :is="as" block focus:outline-none focus-visible:ring="2 primary" v-bind="$attrs">
    <!-- Banner -->
    <div px2 pt2>
      <div rounded of-hidden bg="gray-500/20" aspect="3.19">
        <img h-full w-full object-cover :src="account.header" :alt="$t('account.profile_description', [account.username])">
      </div>
    </div>
    <div px-4 pb-4 space-y-2>
      <!-- User info -->
      <div flex sm:flex-row flex-col flex-gap-2>
        <div flex items-center justify-between>
          <div w-17 h-17 rounded-full border-4 border-bg-base z-2 mt--2 ms--1>
            <AccountAvatar :account="account" />
          </div>
          <NuxtLink block sm:hidden href="javascript:;" @click.stop>
            <AccountFollowButton :account="account" />
          </NuxtLink>
        </div>
        <div sm:mt-2>
          <AccountDisplayName :account="account" font-bold text-lg line-clamp-1 ws-pre-wrap break-all />
          <AccountHandle text-sm :account="account" />
        </div>
      </div>
      <!-- Note -->
      <div v-if="account.note" max-h-100 overflow-y-auto>
        <ContentRich
          :content="account.note" :emojis="account.emojis"
        />
      </div>
      <!-- Follow info -->
      <div flex justify-between items-center>
        <AccountPostsFollowers text-sm :account="account" />
        <NuxtLink sm:block hidden href="javascript:;" @click.stop>
          <AccountFollowButton :account="account" />
        </NuxtLink>
      </div>
    </div>
  </component>
</template>
