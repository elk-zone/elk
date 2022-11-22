<script setup lang="ts">
import type { Account } from 'masto'

const { account, following } = defineProps<{
  account: Account
  following?: boolean
}>()

const masto = await useMasto()

let isFollowing = $ref<boolean | undefined>(following)
watch($$(following), () => {
  isFollowing = following
})

function unfollow() {
  masto.accounts.unfollow(account.id)
  isFollowing = false
}
function follow() {
  masto.accounts.follow(account.id)
  isFollowing = true
}
</script>

<template>
  <div flex justify-between>
    <AccountInfo :account="account" p3 />
    <div h-full p5>
      <div v-if="isFollowing === true" color-purple hover:color-gray hover:cursor-pointer i-ri:user-unfollow-fill @click="unfollow" />
      <div v-else-if="isFollowing === false" color-gray hover:color-purple hover:cursor-pointer i-ri:user-follow-fill @click="follow" />
    </div>
  </div>
</template>
