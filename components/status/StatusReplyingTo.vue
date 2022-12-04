<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const account = useAccountById(status.inReplyToAccountId!)
</script>

<template>
  <div v-if="status.inReplyToAccountId" absolute class="-top-3.5" left-2 bg-base px-2 py-1 rounded-full flex="~ wrap" gap-1>
    <NuxtLink
      v-if="status.inReplyToId"
      flex="~ wrap" items-center text-sm text-secondary gap-1
      :to="getStatusInReplyToRoute(status)"
      :title="account ? `Replying to ${getDisplayName(account)}` : 'Replying to someone'"
    >
      <div i-ri:chat-quote-fill text-secondary-light />
      <template v-if="account?.id !== status.account.id">
        <AccountInlineInfo v-if="account" :account="account" :link="false" />
        <span v-else>Someone</span>
      </template>
    </NuxtLink>
  </div>
</template>
