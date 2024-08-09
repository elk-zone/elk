<script setup lang="ts">
import type { mastodon } from 'masto'
import { fetchAccountById } from '~/composables/cache'

type WatcherType = [status?: mastodon.v1.Status, v?: boolean]

const props = defineProps<{
  status: mastodon.v1.Status
  isSelfReply: boolean
}>()

const link = ref()
const targetIsVisible = ref(false)
const isSelf = computed(() => props.status.inReplyToAccountId === props.status.account.id)
const account = ref<mastodon.v1.Account | null | undefined>(isSelf.value ? props.status.account : undefined)

useIntersectionObserver(
  link,
  ([{ intersectionRatio }]) => {
    targetIsVisible.value = intersectionRatio > 0.1
  },
)

watch(
  () => [props.status, targetIsVisible.value] satisfies WatcherType,
  ([newStatus, newVisible]) => {
    if (newStatus.account && newStatus.inReplyToAccountId === newStatus.account.id) {
      account.value = newStatus.account
      return
    }

    if (!newVisible)
      return

    const newId = newStatus.inReplyToAccountId

    if (newId) {
      fetchAccountById(newStatus.inReplyToAccountId).then((acc) => {
        if (newId === props.status.inReplyToAccountId)
          account.value = acc
      })
      return
    }
    account.value = undefined
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <NuxtLink
    v-if="status.inReplyToId"
    ref="link"
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
