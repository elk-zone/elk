<script setup lang="ts">
import type { akkoma } from 'akko'

const { account, hideEmojis = false } = defineProps<{
  account: akkoma.v1.Account
  hideEmojis?: boolean
}>()
</script>

<template>
  <ContentRich
    :content="getDisplayName(account, { rich: true })"
    :emojis="account.emojis"
    :hide-emojis="hideEmojis"
    :markdown="false"
  />
</template>
