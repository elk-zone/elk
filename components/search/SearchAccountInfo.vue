<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <button flex gap-2 items-center>
    <AccountAvatar w-10 h-10 :account="account" shrink-0 />
    <div flex="~ col gap1" shrink h-full overflow-hidden leading-none>
      <div flex="~" gap-2>
        <ContentRich
          line-clamp-1 ws-pre-wrap break-all text-base
          :content="getDisplayName(account, { rich: true })"
          :emojis="account.emojis"
        />
        <AccountBotIndicator v-if="account.bot" />
      </div>
      <AccountHandle text-sm :account="account" text-secondary-light />
    </div>
  </button>
</template>
