<script setup lang="ts">
import type { Status } from 'masto'

const { status, collapsed = false, simplified = false } = defineProps<{
  status: Status
  collapsed?: boolean
  simplified?: boolean
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
        <template v-if="!collapsed">
          <AccountAvatar
            v-if="isSelf || simplified
              || (checkAuth(currentUser) && status.inReplyToAccountId === currentUser?.account.id)"
            :account="account" :link="false" w-5 h-5 mx-0.5
          />
          <AccountInlineInfo v-else :account="account" :link="false" mx-0.5 />
        </template>
      </template>
      <div i-ri:question-answer-line text-secondary-light text-lg />
    </NuxtLink>
  </div>
</template>
