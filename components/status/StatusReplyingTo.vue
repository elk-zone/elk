<script setup lang="ts">
import type { Status } from 'masto'

const { status, collapsed = false } = defineProps<{
  status: Status
  collapsed: boolean
}>()

const isSelf = $computed(() => status.inReplyToAccountId === status.account.id)
const account = isSelf ? computed(() => status.account) : useAccountById(status.inReplyToAccountId)
</script>

<template>
  <div v-if="status.inReplyToAccountId" flex="~ wrap" gap-1 items-end>
    <NuxtLink
      v-if="status.inReplyToId"
      flex="~" items-center h-auto font-bold text-sm text-secondary gap-1
      :to="getStatusInReplyToRoute(status)"
      :title="account ? `Replying to ${getDisplayName(account)}` : 'Replying to someone'"
    >
      <template v-if="account">
        <div i-ri:reply-fill :class="collapsed ? '' : 'scale-x-[-1]'" text-secondary-light />
        <template v-if="!isSelf">
          <AccountInlineInfo v-if="account" :account="account" :link="false" />
          <span v-else ws-nowrap>{{ $t('status.someone') }}</span>
        </template>
        <span v-else-if="!collapsed" ws-nowrap>{{ $t('status.thread') }}</span>
      </template>
      <div i-ph:chats-fill text-primary text-lg />
    </NuxtLink>
  </div>
</template>
