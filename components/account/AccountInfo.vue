<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true, fullServer = false } = defineProps<{
  account: Account
  link?: boolean
  fullServer?: boolean
  hover?: boolean
}>()
</script>

<template>
  <div flex gap-3 cursor-default>
    <div flex-shrink-0>
      <NuxtLink :to="link ? getAccountPath(account) : null">
        <AccountAvatar :account="account" :hover="hover" w-12 h-12 />
      </NuxtLink>
    </div>
    <NuxtLink flex flex-col :to="link ? getAccountPath(account) : null">
      <ContentRich font-bold hover:underline :content="getDisplayName(account, { rich: true })" :emojis="account.emojis" />
      <AccountHandle :account="account" text-sm op35 />
      <slot name="bottom" />
    </NuxtLink>
    <slot />
  </div>
</template>
