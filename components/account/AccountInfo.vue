<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true, fullServer = false } = defineProps<{
  account: Account
  link?: boolean
  fullServer?: boolean
  hover?: boolean
}>()
</script>

<!-- TODO: Make this work for both buttons and links -->
<!-- This is sometimes (like in the sidebar) used directly as a button, and sometimes, like in follow notifications, as a link. I think this component may need a second refactor that either lets an implementation pass in a link or an action and adapt to what's passed in, or the implementations need to be updated to wrap in the action they want to take and this be just the layout for these items -->
<template>
  <div flex gap-3 cursor-default>
    <div flex-shrink-0>
      <NuxtLink :to="link ? getAccountPath(account) : null">
        <AccountAvatar :account="account" :hover="hover" w-12 h-12 />
      </NuxtLink>
    </div>
    <NuxtLink flex flex-col :to="link ? getAccountPath(account) : null">
      <ContentRich font-bold hover:underline :content="getDisplayName(account, { rich: true })" :emojis="account.emojis" />
      <AccountHandle :account="account" text-sm />
      <slot name="bottom" />
    </NuxtLink>
    <slot />
  </div>
</template>
