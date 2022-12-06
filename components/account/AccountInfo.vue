<script setup lang="ts">
import type { Account } from 'masto'

const { account, as = 'div' } = defineProps<{
  account: Account
  as?: string
  hoverCard?: boolean
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<!-- TODO: Make this work for both buttons and links -->
<!-- This is sometimes (like in the sidebar) used directly as a button, and sometimes, like in follow notifications, as a link. I think this component may need a second refactor that either lets an implementation pass in a link or an action and adapt to what's passed in, or the implementations need to be updated to wrap in the action they want to take and this be just the layout for these items -->
<template>
  <component :is="as" flex gap-3 v-bind="$attrs">
    <AccountHoverWrapper :disabled="!hoverCard" :account="account" shrink-0>
      <AccountAvatar :account="account" w-12 h-12 />
    </AccountHoverWrapper>
    <div flex="~ col" shrink overflow-hidden>
      <ContentRich
        font-bold line-clamp-1 ws-pre-wrap break-all
        :content="getDisplayName(account, { rich: true })"
        :emojis="account.emojis"
      />
      <AccountHandle :account="account" text-sm text-secondary-light />
    </div>
  </component>
</template>
