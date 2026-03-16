<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  account: mastodon.v1.Account
}>()
</script>

<!-- TODO: reuse AccountInfo.vue -->

<template>
  <div flex gap-2 items-center>
    <AccountAvatar w-10 h-10 :account="account" shrink-0 />
    <div flex="~ col gap1" shrink h-full overflow-hidden leading-none>
      <div flex="~" gap-2>
        <AccountDisplayName :account="account" line-clamp-1 ws-pre-wrap break-all text-base />
        <AccountLockIndicator v-if="account.locked" text-xs />
        <AccountBotIndicator v-if="account.bot" text-xs />
      </div>
      <AccountHandle text-sm :account="account" text-secondary-light />
    </div>
  </div>
</template>
