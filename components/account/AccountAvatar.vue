<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  account: mastodon.v1.Account
  square?: boolean
}>()

const loaded = ref(false)
const error = ref(false)

const preferredMotion = usePreferredReducedMotion()
const accountAvatarSrc = computed(() => {
  return preferredMotion.value === 'reduce' ? (props.account?.avatarStatic ?? props.account.avatar) : props.account.avatar
})
</script>

<template>
  <img
    :key="props.account.avatar"
    width="400"
    height="400"
    select-none
    :src="(error || !loaded) ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : accountAvatarSrc"
    :alt="$t('account.avatar_description', [props.account.username])"
    loading="lazy"
    class="account-avatar"
    :class="(loaded ? 'bg-base' : 'bg-gray:10') + (props.square ? ' ' : ' rounded-full')"
    :style="{ 'clip-path': props.square ? `url(#avatar-mask)` : 'none' }"
    v-bind="$attrs"
    @load="loaded = true"
    @error="error = true"
  >
</template>
