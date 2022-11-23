<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const replyingTo = asyncComputed(async () => {
  if (status.inReplyToAccountId)
    return await masto.accounts.fetch(status.inReplyToAccountId)
  return null
})
</script>

<template>
  <template v-if="replyingTo">
    <div
      flex="~ gap-1.5" items-center text-sm text-gray:85
      :title="`Replying to ${getDisplayName(replyingTo)}`"
    >
      <div i-ri:reply-fill rotate-180 op50 />
      <AccountInlineInfo :account="replyingTo" />
    </div>
  </template>
</template>
