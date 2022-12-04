<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const account = useAccountById(status.inReplyToAccountId!)
</script>

<template>
  <NuxtLink
    v-if="status.inReplyToId"
    flex="~ wrap" items-center text-sm text-secondary
    :to="getStatusInReplyToRoute(status)"
    :title="account ? `Replying to ${getDisplayName(account)}` : 'Replying to someone'"
  >
    <div i-ri:chat-quote-fill text-secondary-light class="mr-1.5" />
    <template v-if="account?.id !== status.account.id">
      <AccountInlineInfo v-if="account" :account="account" :link="false" />
      <span v-else>Someone</span>
    </template>
  </NuxtLink>
</template>
