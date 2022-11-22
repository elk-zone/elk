<script setup lang="ts">
import type { Account, MastoClient } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const relationship = $(useRelationship(account))

let masto: MastoClient

async function toggleFollow() {
  relationship!.following = !relationship!.following
  masto ??= await useMasto()
  await masto.accounts[relationship!.following ? 'follow' : 'unfollow'](account.id)
}
</script>

<template>
  <button v-if="relationship" flex gap-1 items-center w-full rounded hover="op100 text-white b-purple" group @click="toggleFollow">
    <div rounded w-28 p2 :group-hover="relationship?.following ? 'bg-red/30' : 'bg-purple/30'" :class="!relationship?.following ? 'bg-cyan/10' : ' bg-purple/10'">
      <template v-if="relationship?.following">
        <span group-hover="hidden">Following</span>
        <span hidden group-hover="inline">Unfollow</span>
      </template>
      <template v-else>
        {{ relationship?.followedBy ? 'Follow back' : 'Follow' }}
      </template>
    </div>
  </button>
</template>
