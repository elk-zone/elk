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
    p-4 py-2
    light:bg-gray-3 dark:bg-gray-8
  >
    <span z-0>More from</span>
    <AccountInlineInfo :account="account" hover:bg-inherit ps-0 ms-0 />
  </div>
</template>
