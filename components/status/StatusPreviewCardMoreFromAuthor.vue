<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  account: mastodon.v1.Account
}>()
</script>

<template>
  <div
    max-h-2xl
    flex gap-2
    my-auto
    bg-gray-300
  >
    <span z-0>More from</span>
    <AccountInlineInfo :account="account" hover:bg-gray-300 />
  </div>
</template>
