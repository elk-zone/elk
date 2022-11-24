<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const account = await fetchAccount(status.inReplyToAccountId!)
</script>

<template>
  <template v-if="account">
    <div
      flex="~ gap-1.5" items-center text-sm text-gray:85
      :title="`Replying to ${getDisplayName(account)}`"
    >
      <div i-ri:reply-fill rotate-180 op50 />
      <AccountInlineInfo :account="account" />
    </div>
  </template>
</template>
