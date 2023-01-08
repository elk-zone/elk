<script setup lang="ts">
import type { Status } from 'masto'

const {
  status,
  isSelfReply = false,
} = defineProps<{
  status: Status
  isSelfReply: boolean
}>()

const isSelf = $computed(() => status.inReplyToAccountId === status.account.id)
const account = isSelf ? computed(() => status.account) : useAccountById(status.inReplyToAccountId)
</script>

<template>
  <NuxtLink
    v-if="status.inReplyToId"
    flex="~ gap2" items-center h-auto text-sm text-secondary
    :to="getStatusInReplyToRoute(status)"
    :title=" $t('status.replying_to', [account ? getDisplayName(account) : $t('status.someone')])"
  >
    <template v-if="isSelfReply">
      <span btn-text p0 mb-1>{{ $t('status.show_full_thread') }}</span>
    </template>
    <template v-else>
      <div i-ri-chat-1-line />
      <i18n-t keypath="status.replying_to">
        <template v-if="account">
          <AccountInlineInfo :account="account" :link="false" mx1 />
        </template>
        <template v-else>
          {{ $t('status.someone') }}
        </template>
      </i18n-t>
    </template>
  </NuxtLink>
</template>
