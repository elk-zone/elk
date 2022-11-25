<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const account = asyncComputed(() => fetchAccount(status.inReplyToAccountId!))
</script>

<template>
  <NuxtLink
    v-if="status.inReplyToId"
    flex="~ wrap" items-center text-sm text-gray:85
    :to="getStatusInReplyToPath(status)"
    :title="account ? `Replying to ${getDisplayName(account)}` : 'Replying to someone'"
  >
    <div i-ri:reply-fill rotate-180 op50 class="mr-1.5" />
    <AccountInlineInfo v-if="account" :account="account" :link="false" />
    <span v-else>Someone</span>
    's post
  </NuxtLink>
</template>
