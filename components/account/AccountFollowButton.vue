<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const isSelf = $computed(() => currentUser.value?.account?.id === account.id)
const relationship = $(useRelationship(account))

async function toggleFollow() {
  relationship!.following = !relationship!.following
  await masto.accounts[relationship!.following ? 'follow' : 'unfollow'](account.id)
}
</script>

<template>
  <button
    v-if="!isSelf && relationship"
    flex gap-1 items-center h-fit rounded hover="op100 text-white b-purple" group
    @click="toggleFollow"
  >
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
