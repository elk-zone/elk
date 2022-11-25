<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const isSelf = $computed(() => currentUser.value?.account.id === account.id)
const relationship = $(useRelationship(account))

async function toggleFollow() {
  relationship!.following = !relationship!.following
  await masto.accounts[relationship!.following ? 'follow' : 'unfollow'](account.id)
}
</script>

<template>
  <button
    v-if="!isSelf && relationship"
    flex gap-1 items-center h-fit rounded hover="op100 text-white b-orange" group
    @click="toggleFollow"
  >
    <div rounded w-28 p2 :group-hover="relationship?.following ? 'bg-red/75' : 'bg-orange/40'" :class="!relationship?.following ? relationship?.followedBy ? 'bg-orange/20' : 'bg-white/10' : relationship?.followedBy ? ' bg-orange/70' : 'bg-orange/50'">
      <template v-if="relationship?.following">
        <span group-hover="hidden">{{ relationship?.followedBy ? 'Mutuals' : 'Following' }}</span>
        <span hidden group-hover="inline">Unfollow</span>
      </template>
      <template v-else-if="relationship?.followedBy">
        <span group-hover="hidden">Follows you</span>
        <span hidden group-hover="inline">Follow back</span>
      </template>
      <template v-else>
        <span>Follow</span>
      </template>
    </div>
  </button>
</template>
