<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true, fullServer = false } = defineProps<{
  account: Account
  link?: boolean
  fullServer?: boolean
}>()

const id = computed(() => fullServer && !account.acct.includes('@') ? `@${account.acct}@${account.url.match(UserLinkRE)?.[1]}` : `@${account.acct}`)
</script>

<template>
  <div flex gap-3>
    <div>
      <NuxtLink :to="link ? `/@${account.acct}` : null">
        <AccountAvatar :account="account" w-12 h-12 />
      </NuxtLink>
    </div>
    <NuxtLink flex flex-col :to="link ? `/@${account.acct}` : null">
      <CommonRichContent font-bold :content="getDisplayName(account)" :emojis="account.emojis" />
      <p op35 text-sm>
        {{ id }}
      </p>
      <slot name="bottom" />
    </NuxtLink>
    <slot />
  </div>
</template>
