<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const account = useAccountById(status.inReplyToAccountId)
</script>

<template>
  <div v-if="status.inReplyToAccountId" flex="~ wrap" gap-1>
    <NuxtLink
      v-if="status.inReplyToId"
      flex="~" items-center font-bold text-sm text-secondary gap-1
      :to="getStatusInReplyToRoute(status)"
      :title="account ? `Replying to ${getDisplayName(account)}` : 'Replying to someone'"
    >
      <div i-ri:reply-fill class="scale-x-[-1]" text-secondary-light />
      <template v-if="account?.id !== status.account.id">
        <AccountInlineInfo v-if="account" :account="account" :link="false" />
        <span v-else ws-nowrap>{{ $t('status.someone') }}</span>
      </template>
      <span v-else ws-nowrap>{{ $t('status.thread') }}</span>
      <div i-ph:chats-fill text-primary text-lg />
    </NuxtLink>
  </div>
</template>
