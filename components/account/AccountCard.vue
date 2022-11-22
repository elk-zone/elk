<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const masto = await useMasto()

const relationship = $(useRelationship(account))

function unfollow() {
  masto.accounts.unfollow(account.id)
  relationship!.following = false
}
function follow() {
  masto.accounts.follow(account.id)
  relationship!.following = true
}
</script>

<template>
  <div flex justify-between>
    <AccountInfo :account="account" p3 />
    <div h-full p5>
      <div v-if="relationship?.following === true" color-purple hover:color-gray hover:cursor-pointer i-ri:user-unfollow-fill @click="unfollow" />
      <div v-else-if="relationship?.following === false" color-gray hover:color-purple hover:cursor-pointer i-ri:user-follow-fill @click="follow" />
    </div>
  </div>
</template>
