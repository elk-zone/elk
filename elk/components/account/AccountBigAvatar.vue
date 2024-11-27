<script setup lang="ts">
import type { akkoma } from 'akko'

// Avatar with a background base achieving a 3px border to be used in status cards
// The border is used for Avatar on Avatar for reblogs and connecting replies

defineProps<{
  account: akkoma.v1.Account
  square?: boolean
}>()
</script>

<template>
  <div :key="account.avatar" v-bind="$attrs" :style="{ 'clip-path': square ? `url(#avatar-mask)` : 'none' }" :class="{ 'rounded-full': !square }" bg-base w-54px h-54px flex items-center justify-center>
    <AccountAvatar :account="account" w-48px h-48px :square="square" />
  </div>
</template>
