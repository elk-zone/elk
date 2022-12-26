<script setup lang="ts">
import type { Account } from 'masto'

const props = defineProps<{
  account?: Account
  handle?: string
  disabled?: boolean
}>()

const account = props.account || (props.handle ? useAccountByHandle(props.handle!) : undefined)
defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <VMenu v-if="!disabled && account" placement="bottom-start" :delay="{ show: 500, hide: 100 }" v-bind="$attrs" :close-on-content-click="false">
    <slot />
    <template #popper>
      <AccountHoverCard v-if="account" :account="account" />
    </template>
  </VMenu>
  <slot v-else />
</template>
