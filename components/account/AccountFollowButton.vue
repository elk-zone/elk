<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const isSelf = $computed(() => currentUser.value?.account.id === account.id)
let relationship = $(useRelationship(account))

async function toggleFollow() {
  relationship!.following = !relationship!.following
  try {
    relationship = await useMasto().accounts[relationship!.following ? 'follow' : 'unfollow'](account.id)
  }
  catch {
    // TODO error handling
    relationship!.following = !relationship!.following
  }
}
</script>

<template>
  <button
    v-if="!isSelf && currentUser"
    flex gap-1 items-center h-fit rounded hover="op100 text-white b-orange" group btn-base
    :disabled="relationship?.requested"
    @click="toggleFollow"
  >
    <div rounded w-28 p2 :group-hover="relationship?.following ? 'bg-red/75' : 'bg-orange/40'" :class="!relationship?.following ? relationship?.followedBy ? 'bg-orange/20' : 'bg-white/10' : relationship?.followedBy ? ' bg-orange/70' : 'bg-orange/50'">
      <template v-if="relationship?.following">
        <span group-hover="hidden">{{ relationship?.followedBy ? 'Mutuals' : 'Following' }}</span>
        <span hidden group-hover="inline">{{ $t('account.unfollow') }}</span>
      </template>
      <template v-else-if="relationship?.requested">
        <span>{{ $t('account.follow_requested') }}</span>
      </template>
      <template v-else-if="relationship?.followedBy">
        <span group-hover="hidden">{{ $t('account.follows_you') }}</span>
        <span hidden group-hover="inline">{{ $t('account.follow_back') }}</span>
      </template>
      <template v-else>
        <span>{{ $t('account.follow') }}</span>
      </template>
    </div>
  </button>
</template>
