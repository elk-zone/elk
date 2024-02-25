<script setup lang="ts">
import type { mastodon } from 'masto'

const {
  status,
  isSelfReply = false,
} = defineProps<{
  status: mastodon.v1.Status
  isSelfReply: boolean
}>()

const isSelf = computed(() => status.inReplyToAccountId === status.account.id)
const account = isSelf ? computed(() => status.account) : useAccountById(status.inReplyToAccountId)
</script>

<template>
  <NuxtLink
    v-if="status.inReplyToId"
    flex="~ gap2" items-center h-auto text-sm text-secondary
    :to="getStatusInReplyToRoute(status)"
    :title="$t('status.replying_to', [account ? getDisplayName(account) : $t('status.someone')])"
    text-blue saturate-50 hover:saturate-100
  >
    <template v-if="isSelfReply">
      <div i-ri-discuss-line text-blue />
      <span>{{ $t('status.show_full_thread') }}</span>
    </template>
    <template v-else>
      <div i-ri-chat-1-line text-blue />
      <div ws-nowrap flex>
        <i18n-t keypath="status.replying_to">
          <template v-if="account">
            <AccountInlineInfo :account="account" :link="false" m-inline-2 />
          </template>
          <template v-else>
            {{ $t('status.someone') }}
          </template>
        </i18n-t>
      </div>
    </template>
  </NuxtLink>
</template>
