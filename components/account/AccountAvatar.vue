<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
  hover?: boolean
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div v-if="hover" relative flex-shrink-0>
    <div group>
      <AccountHoverCard top="-3.2" left="-4.4" absolute :account="account" op0 pointer-events-none group-hover="pointer-events-auto op100 scale-100" font-normal delay-250 transition transform scale-20 class="ease-[cubic-bezier(0.4, 0.0, 0.2, 1)]" />
      <AccountAvatarImage :account="account" v-bind="$attrs" />
    </div>
  </div>

  <AccountAvatarImage v-else :account="account" v-bind="$attrs" />
</template>
