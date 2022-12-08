<script lang="ts" setup>
import type { Account } from 'masto'
const { account, as = 'div' } = $defineProps<{
  account: Account
  as?: string
}>()

cacheAccount(account)

defineOptions({
  inheritAttrs: false,
})
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
          <div w-17 h-17 rounded-full border-4 border-bg-base z-2 mt--2 ml--1>
            <AccountAvatar :account="account" />
          </div>
          <div block sm:hidden>
            <AccountFollowButton :account="account" />
          </div>
        </div>
        <div sm:mt-2>
          <div>
            <ContentRich
              font-bold text-lg line-clamp-1 ws-pre-wrap break-all
              :content="getDisplayName(account, { rich: true })"
              :emojis="account.emojis"
            />
          </div>
          <AccountHandle text-sm :account="account" />
        </div>
      </div>
      <!-- Note -->
      <div v-if="account.note">
        <ContentRich
          :content="account.note" :emojis="account.emojis"
          line-clamp-2
        />
      </div>
      <!-- Follow info -->
      <div flex justify-between items-center>
        <AccountPostsFollowers text-sm :account="account" />
        <div sm:block hidden>
          <AccountFollowButton :account="account" />
        </div>
      </div>
    </div>
  </component>
</template>
