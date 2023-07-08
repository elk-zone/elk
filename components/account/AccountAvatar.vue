<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, status } = defineProps<{
  account: mastodon.v1.Account
  square?: boolean
  status?: mastodon.v1.Status
}>()

const loaded = $ref(false)
const error = $ref(false)

const viewTransitionStyle = computed(() => {
  if (!status)
    return

  const targets = getViewTransitionTargets().value
  if (targets.statusId === status.id && targets.accountId === account.id)
    return { 'view-transition-name': 'account-avatar' }
})
</script>

<template>
  <img
    :key="account.avatar"
    v-bind="$attrs"
    width="400"
    height="400"
    select-none
    :src="(error || !loaded) ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : account.avatar"
    :alt="$t('account.avatar_description', [account.username])"
    loading="lazy"
    class="account-avatar"
    :class="(loaded ? 'bg-base' : 'bg-gray:10') + (square ? ' ' : ' rounded-full')"
    :style="{ 'clip-path': square ? `url(#avatar-mask)` : 'none', ...viewTransitionStyle }"
    @load="loaded = true"
    @error="error = true"
  >
</template>
