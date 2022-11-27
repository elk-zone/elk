<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AccountAvatarImage :account="account" v-bind="$attrs" />
</template>
