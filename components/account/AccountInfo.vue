<script setup lang="ts">
import type { Account } from 'masto'

const { link = true } = defineProps<{
  account: Account
  link?: boolean
}>()
</script>

<template>
  <div flex gap-2>
    <div p1>
      <NuxtLink :to="link ? `/@${account.acct}` : null">
        <AccountAvatar :account="account" w-10 h-10 />
      </NuxtLink>
    </div>
    <NuxtLink flex flex-col :to="link ? `/@${account.acct}` : null">
      <CommonRichContent font-bold :content="getDisplayName(account)" :emojis="account.emojis" />
      <p op35 text-sm>
        @{{ account.acct }}
      </p>
    </NuxtLink>
    <slot />
  </div>
</template>
