<script setup lang="ts">
import type { Account } from 'masto'

const { account, link = true, fullServer = false } = defineProps<{
  account: Account
  link?: boolean
  fullServer?: boolean
  hover?: boolean
}>()

const accountHandle = $(useAccountHandle(account, fullServer))
</script>

<!-- TODO: Make this work for both buttons and links -->
<!-- This is sometimes (like in the sidebar) used directly as a button, and sometimes, like in follow notifications, as a link. I think this component may need a second refactor that either lets an implementation pass in a link or an action and adapt to what's passed in, or the implementations need to be updated to wrap in the action they want to take and this be just the layout for these items -->
<template>
  <button gap-3 cursor-default class="account-switcher" :account="currentUser.account">
    <AccountAvatar :account="account" :hover="hover" class="account-icon" />
    <h3>
      <ContentRichSetup font-bold hover:underline :content="getDisplayName(account)" :emojis="account.emojis" />
    </h3>
    <p text-sm>
      {{ accountHandle }}
    </p>
    <slot name="bottom" />
  </button>
</template>

<style>
  .account-switcher {
    display: grid;
    grid-template-columns: 3rem auto;
    row-gap: 0;
    text-align: left
  }

  .account-icon {
    grid-row: span 2;
  }
</style>
