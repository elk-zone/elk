<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <div flex justify-between>
    <AccountInfo :account="account" p3 />
    <div h-full p5>
      <!-- TODO is following logic and actions -->
      <div v-if="false" color-purple hover:color-gray hover:cursor-pointer i-ri:user-unfollow-fill />
      <div v-else color-gray hover:color-purple hover:cursor-pointer i-ri:user-follow-fill />
    </div>
  </div>
</template>
