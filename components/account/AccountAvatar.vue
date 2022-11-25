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
  <div relative flex-shrink-0>
    <div group>
      <AccountHoverCard v-if="hover" top="-3.2" left="-4.4" absolute :account="account" op0 pointer-events-none group-hover="pointer-events-auto op100 scale-100" delay-250 transition transform scale-20 class="ease-[cubic-bezier(0.4, 0.0, 0.2, 1)]" />
      <img
        :src="account.avatar"
        :alt="account.username"
        loading="lazy"
        rounded-full bg-gray:10
        v-bind="$attrs"
      >
    </div>
  </div>
</template>
