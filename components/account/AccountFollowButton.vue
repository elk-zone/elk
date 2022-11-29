<script setup lang="ts">
import type { Account } from 'masto'

const { account, command } = defineProps<{
  account: Account
  command?: boolean
}>()

const { t } = useI18n()

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
    flex gap-1 items-center h-fit rounded hover="op100 text-white b-orange" group btn-base
    :disabled="relationship?.requested"
    @click="toggleFollow"
  >
    <div rounded w-28 p2 :group-hover="relationship?.following ? 'bg-red/75' : 'bg-orange/40'" :class="!relationship?.following ? relationship?.followedBy ? 'bg-orange/20' : 'bg-white/10' : relationship?.followedBy ? ' bg-orange/70' : 'bg-orange/50'">
      <template v-if="relationship?.following">
        <span group-hover="hidden">{{ relationship?.followedBy ? t('account.mutuals') : t('account.following') }}</span>
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
