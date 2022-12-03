<script setup lang="ts">
import type { Account, Relationship } from 'masto'

const { account, command, ...props } = defineProps<{
  account: Account
  relationship?: Relationship
  command?: boolean
}>()

const isSelf = $computed(() => currentUser.value?.account.id === account.id)
const enable = $computed(() => !isSelf && currentUser.value)
const relationship = $$(props.relationship) ?? useRelationship(account)

async function toggleFollow() {
  const rel = relationship.value
  rel!.following = !rel!.following
  try {
    relationship.value = await useMasto().accounts[rel!.following ? 'follow' : 'unfollow'](account.id)
  }
  catch {
    // TODO error handling
    rel!.following = !rel!.following
  }
}

const { t } = useI18n()

useCommand({
  scope: 'Actions',
  order: -2,
  visible: () => command && enable,
  name: () => `${relationship.value?.following ? t('account.unfollow') : t('account.follow')} ${getShortHandle(account)}`,
  icon: 'i-ri:star-line',
  onActivate: () => toggleFollow(),
})

const buttonStyle = $computed(() => {
  const rel = relationship.value

  // Skeleton while loading, avoid primary color flash
  if (!rel)
    return 'text-inverted'

  // If following, use a label style with a strong border for Mutuals
  if (rel.following)
    return `text-base ${rel.followedBy ? 'border-strong' : 'border-base'}`

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
    rounded-full flex="~ gap2 center" font-500 w-30 h-fit py1 :class="buttonStyle" :hover="relationship?.following ? 'border-red text-red' : 'bg-base border-primary text-primary'" @click="toggleFollow"
  >
    <template v-if="relationship?.following">
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
