<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'
import { fetchRelationships, toggleBlockAccount, toggleFollowAccount, toggleMuteAccount, useRelationship } from '~/composables/akko/relationship'

const { account, command, context, ...props } = defineProps<{
  account: akkoma.v1.Account
  relationship?: akkoma.v1.Relationship
  context?: 'followedBy' | 'following'
  command?: boolean
}>()

const { t } = useI18n()
const isSelf = useSelfAccount(() => account)
const enable = computed(() => !isSelf.value && currentUser.value)
const relationship = props.relationship ? ref(props.relationship) : useRelationship(account)
const isLoading = ref(false)
let intervalHandle: NodeJS.Timeout | undefined

// when asking to follow a remote account or when account is locked, relationship.requested will be true
// we sometimes poll the relationship to get if remote server or user accepted the follow request
function updateRequestedFollow() {
  if (intervalHandle) {
    clearTimeout(intervalHandle)
    intervalHandle = undefined
  }
  if (!relationship.value?.requested)
    return
  intervalHandle = setTimeout(() => {
    intervalHandle = undefined
    fetchRelationships(account, relationship, true)
  }, 5000)
}

watch(relationship, updateRequestedFollow)

const buttonStyle = computed(() => {
  if (relationship.value?.blocking)
    return 'text-inverted bg-red border-red'

  if (relationship.value?.muting)
    return 'text-base bg-card border-base'

  // If following, use a label style with a strong border for Mutuals
  if (relationship.value ? relationship.value.following : context === 'following')
    return `text-base ${relationship.value?.followedBy ? 'border-strong' : 'border-base'}`

  // If loading, use a plain style
  if (isLoading.value)
    return 'text-base border-base'

  // If not following, use a button style
  return 'text-inverted bg-primary border-primary'
})

async function onClick() {
  let method = toggleFollowAccount
  if (relationship.value?.blocking)
    method = toggleBlockAccount
  else if (relationship.value?.muting)
    method = toggleMuteAccount
  isLoading.value = true
  const restoreRelationship = JSON.parse(JSON.stringify(relationship.value))
  try {
    const updatedRelationship = await method(relationship.value!, account)
    relationship.value = updatedRelationship
  }
  catch (e) {
    console.error(e)
    relationship.value = restoreRelationship
    // TODO error handling
  }
  isLoading.value = false
}

useCommand({
  scope: 'Actions',
  order: -2,
  visible: () => command && enable,
  name: () => `${relationship.value?.following ? t('account.unfollow') : t('account.follow')} ${getShortHandle(account)}`,
  icon: 'i-ri:star-line',
  onActivate: onClick,
})
</script>

<template>
  <button
    v-if="enable" gap-1 items-center group border-1 rounded-full flex="~ gap2 center" font-500 min-w-30 h-fit px3
    py1 :class="buttonStyle"
    :hover="!relationship?.blocking && !relationship?.muting && relationship?.following ? 'border-red text-red' : 'bg-base border-primary text-primary'"
    @click="onClick"
  >
    <template v-if="!relationship || isLoading">
      <span i-svg-spinners-180-ring-with-bg />
    </template>
    <template v-else>
      <template v-if="relationship?.blocking">
        <span elk-group-hover="hidden">{{ $t('account.blocking') }}</span>
        <span hidden elk-group-hover="inline">{{ $t('account.unblock') }}</span>
      </template>
      <template v-else>
        <template v-if="relationship?.muting">
          <span elk-group-hover="hidden">{{ $t('account.muting') }}</span>
          <span hidden elk-group-hover="inline">{{ $t('account.unmute') }}</span>
        </template>
        <template v-else-if="relationship ? relationship.following : context === 'following'">
          <span elk-group-hover="hidden">{{ relationship?.followedBy ? $t('account.mutuals') : $t('account.following')
          }}</span>
          <span hidden elk-group-hover="inline">{{ $t('account.unfollow') }}</span>
        </template>
        <template v-else-if="relationship?.requested">
          <span elk-group-hover="hidden">{{ account.locked ? $t('account.follow_requested') : $t('account.follow_pending') }}</span>
          <span hidden elk-group-hover="inline">{{ $t('account.withdraw_follow_request') }}</span>
        </template>
        <template v-else-if="relationship ? relationship.followedBy : context === 'followedBy'">
          <span elk-group-hover="hidden">{{ $t('account.follows_you') }}</span>
          <span hidden elk-group-hover="inline">{{ account.locked ? $t('account.request_follow')
            : $t('account.follow_back') }}</span>
        </template>
        <template v-else>
          <span>{{ account.locked ? $t('account.request_follow') : $t('account.follow') }}</span>
        </template>
      </template>
    </template>
  </button>
</template>
