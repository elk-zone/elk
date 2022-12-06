<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const account = useAccountById(status.inReplyToAccountId!)
</script>

<template>
  <div v-if="status.inReplyToAccountId" absolute top-0 pt-2 right-0 bg-base px-4 rounded-lb-2 flex="~ wrap" gap-1>
    <NuxtLink
      v-if="status.inReplyToId"
      flex="~ wrap" items-center font-bold text-sm text-secondary gap-1
      :to="getStatusInReplyToRoute(status)"
      :title="account ? `Replying to ${getDisplayName(account)}` : 'Replying to someone'"
    >
      <div i-ri:reply-fill class="scale-x-[-1]" text-secondary-light />
      <template v-if="account?.id !== status.account.id">
        <AccountInlineInfo v-if="account" :account="account" :link="false" />
        <span v-else>Someone</span>
      </template>
      <span v-else>Thread</span>
      <div i-ph:chats-fill text-primary text-lg />
    </NuxtLink>
  </div>
</template>
