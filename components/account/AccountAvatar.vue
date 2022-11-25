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
      <AccountHoverCard
        :account="account"
        absolute top-0 left-0 z-10
        op0 pointer-events-none rotate--2
        font-normal delay-300 duration-300 transition transform
        group-hover="pointer-events-auto op100 rotate-0"
        translate="x-[calc(-1rem-1px)] y-[calc(-1rem-1px)]"
        class="ease-[cubic-bezier(0.4, 0.0, 0.2, 1)]"
        style="transform-origin: calc(1rem + 1px) calc(0.75rem + 1px);"
      />
      <AccountAvatarImage :account="account" v-bind="$attrs" />
    </div>
  </div>
  <AccountAvatarImage v-else :account="account" v-bind="$attrs" />
</template>
