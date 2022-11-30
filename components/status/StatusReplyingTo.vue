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
    <div i-ri:reply-fill rotate-180 text-secondary-light class="mr-1.5" />
    <AccountInlineInfo v-if="account" :account="account" :link="false" />
    <span v-else>Someone</span>
  </NuxtLink>
</template>
