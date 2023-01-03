<script setup lang="ts">
import type { Account, Relationship } from 'masto'

const { account, command, ...props } = defineProps<{
  account: Account
  relationship?: Relationship
  command?: boolean
}>()

const isSelf = $computed(() => checkAuth(currentUser.value) && currentUser.value.account.id === account.id)
const enable = $computed(() => !isSelf && !isGuest.value)
const relationship = $computed(() => props.relationship || useRelationship(account).value)

const masto = useMasto()
async function toggleFollow() {
  relationship!.following = !relationship!.following
  try {
    const newRel = await masto.accounts[relationship!.following ? 'follow' : 'unfollow'](account.id)
    Object.assign(relationship!, newRel)
  }
  catch {
    // TODO error handling
    relationship!.following = !relationship!.following
  }
}

async function unblock() {
  relationship!.blocking = false
  try {
    const newRel = await masto.accounts.unblock(account.id)
    Object.assign(relationship!, newRel)
  }
  catch {
    // TODO error handling
    relationship!.blocking = true
  }
}

async function unmute() {
  relationship!.muting = false
  try {
    const newRel = await masto.accounts.unmute(account.id)
    Object.assign(relationship!, newRel)
  }
  catch {
    // TODO error handling
    relationship!.muting = true
  }
}

const { t } = useI18n()

useCommand({
  scope: 'Actions',
  order: -2,
  visible: () => command && enable,
  name: () => `${relationship?.following ? t('account.unfollow') : t('account.follow')} ${getShortHandle(account)}`,
  icon: 'i-ri:star-line',
  onActivate: () => toggleFollow(),
})

const buttonStyle = $computed(() => {
  // Skeleton while loading, avoid primary color flash
  if (!relationship)
    return 'text-inverted'

  if (relationship.blocking)
    return 'text-inverted bg-red border-red'

  if (relationship.muting)
    return 'text-base bg-code border-base'

  // If following, use a label style with a strong border for Mutuals
  if (relationship.following)
    return `text-base ${relationship.followedBy ? 'border-strong' : 'border-base'}`

  // If not following, use a button style
  return 'text-inverted bg-primary border-primary'
})
</script>

<template>
  <button
    v-if="enable"
    gap-1 items-center group
    :disabled="relationship?.requested"
    border-1
    rounded-full flex="~ gap2 center" font-500 w-30 h-fit py1
    :class="buttonStyle"
    :hover="!relationship?.blocking && !relationship?.muting && relationship?.following ? 'border-red text-red' : 'bg-base border-primary text-primary'"
    @click="relationship?.blocking ? unblock() : relationship?.muting ? unmute() : toggleFollow()"
  >
    <template v-if="relationship?.blocking">
      <span group-hover="hidden">{{ $t('account.blocking') }}</span>
      <span hidden group-hover="inline">{{ $t('account.unblock') }}</span>
    </template>
    <template v-if="relationship?.muting">
      <span group-hover="hidden">{{ $t('account.muting') }}</span>
      <span hidden group-hover="inline">{{ $t('account.unmute') }}</span>
    </template>
    <template v-else-if="relationship?.following">
      <span group-hover="hidden">{{ relationship?.followedBy ? $t('account.mutuals') : $t('account.following') }}</span>
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
