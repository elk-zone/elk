<script setup lang="ts">
import type { mastodon } from 'masto'

defineOptions({
  inheritAttrs: false,
})

const { account, as = 'div' } = defineProps<{
  account: mastodon.v1.Account
  status?: mastodon.v1.Status
  as?: string
  hoverCard?: boolean
  square?: boolean
}>()
</script>

<!-- TODO: Make this work for both buttons and links -->
<!-- This is sometimes (like in the sidebar) used directly as a button, and sometimes, like in follow notifications, as a link. I think this component may need a second refactor that either lets an implementation pass in a link or an action and adapt to what's passed in, or the implementations need to be updated to wrap in the action they want to take and this be just the layout for these items -->
<template>
  <component :is="as" flex gap-3 v-bind="$attrs">
    <AccountHoverWrapper :disabled="!hoverCard" :account="account">
      <AccountBigAvatar :account="account" :status="status" shrink-0 :square="square" />
    </AccountHoverWrapper>
    <div flex="~ col" shrink pt-1 h-full overflow-hidden justify-center leading-none select-none>
      <div flex="~" gap-2>
        <AccountDisplayName :account="account" :status="status" font-bold line-clamp-1 ws-pre-wrap break-all text-lg />
        <AccountRolesIndicator v-if="account.roles?.length" :account="account" :limit="1" />
        <AccountLockIndicator v-if="account.locked" text-xs />
        <AccountBotIndicator v-if="account.bot" text-xs />
      </div>
      <AccountHandle :account="account" :status="status" text-secondary-light />
    </div>
  </component>
</template>
