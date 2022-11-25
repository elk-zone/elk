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
      flex group
      @click="toggleFollow"
    >
     <div v-if="!relationship?.following" rounded-l p2 w-11 h-10 flex justify-center items-center :group-hover="relationship?.following ? 'bg-white/10' : 'bg-white/10'" :class="!relationship?.following ? relationship?.followedBy ? 'bg-white/10' : 'bg-white/10' : relationship?.followedBy ? ' bg-white/10' : 'bg-white/10'">
        <div i-ri:user-follow-fill group-hover="color-orange/85"/>
      </div>
      <div w-28 p2 h-10 :group-hover="relationship?.following ? 'bg-red/75' : 'bg-orange/40'" :class="!relationship?.following ? ('rounded-r ' + (relationship?.followedBy ? 'bg-orange/20' : 'bg-white/20')) : ('rounded ' + (relationship?.followedBy ? 'bg-orange/70' : 'bg-orange/50'))">
        <template v-if="relationship?.following">
          <span group-hover="hidden">{{ relationship?.followedBy ? 'Mutuals' : 'Following' }}</span>
          <span hidden group-hover="inline">Unfollow</span>
        </template>
        <template v-else-if="relationship?.followedBy">
          <span group-hover="hidden">Follows you</span>
          <span hidden group-hover="inline">Follow back</span>
        </template>
        <template v-else>
          <span group-hover="hidden">Unrelated</span>
          <span hidden group-hover="inline">Follow</span>
        </template>
      </div>
    </button>
</template>
