<script setup lang="ts">
import type { Account } from 'masto'

const { account, command } = defineProps<{
  account: Account
  command?: boolean
}>()

const isSelf = $computed(() => currentUser.value?.account.id === account.id)
const enable = $computed(() => !isSelf && currentUser.value)
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

useCommand({
  scope: 'Actions',

  order: -2,

  visible: () => command && enable,

  name: () => `${relationship?.following ? 'Unfollow' : 'Follow'} ${getShortHandle(account)}`,
  icon: 'i-ri:star-line',

  onActivate: () => toggleFollow(),
})
</script>

<template>
  <button
    v-if="enable"
    gap-1 items-center group
    :disabled="relationship?.requested"
    border-1
    rounded-full flex="~ gap2 center" font-500 w-30 h-fit py1 :class="relationship?.following ? 'text-base border-text-base' : 'text-inverted bg-primary border-primary'" :hover="relationship?.following ? 'border-red text-red' : 'bg-base border-primary text-primary'" @click="toggleFollow"
  >
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
  </button>
</template>
