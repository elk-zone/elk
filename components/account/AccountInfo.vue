<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true, fullServer = false } = defineProps<{
  account: Account
  link?: boolean
  fullServer?: boolean
  hover?: boolean
}>()

const accountHandle = $(useAccountHandle(account, fullServer))
</script>

<template>
  <div flex gap-3 cursor-default>
    <div>
      <NuxtLink :to="link ? getAccountPath(account) : null">
        <AccountAvatar :account="account" :hover="hover" w-12 h-12 />
      </NuxtLink>
    </div>
    <NuxtLink flex flex-col :to="link ? getAccountPath(account) : null">
      <ContentRichSetup font-bold hover:underline :content="getDisplayName(account)" :emojis="account.emojis" />
      <p op35 text-sm>
        {{ accountHandle }}
      </p>
      <slot name="bottom" />
    </NuxtLink>
    <slot />
  </div>
</template>
