<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, ...props } = defineProps<{
  account: mastodon.v1.Account
  relationship?: mastodon.v1.Relationship
}>()
const relationship = computed(() => props.relationship || useRelationship(account).value)
const { client } = useMasto()

async function authorizeFollowRequest() {
  relationship.value!.requestedBy = false
  relationship.value!.followedBy = true
  try {
    const newRel = await client.value.v1.followRequests.$select(account.id).authorize()
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    relationship.value!.requestedBy = true
    relationship.value!.followedBy = false
  }
}

async function rejectFollowRequest() {
  relationship.value!.requestedBy = false
  try {
    const newRel = await client.value.v1.followRequests.$select(account.id).reject()
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    relationship.value!.requestedBy = true
  }
}
</script>

<template>
  <div flex gap-4>
    <template v-if="relationship?.requestedBy">
      <CommonTooltip :content="$t('account.authorize')">
        <button
          type="button"
          rounded-full text-sm p2 border-1
          hover:text-green transition-colors
          @click="authorizeFollowRequest"
        >
          <span block text-current i-ri:check-fill />
        </button>
      </CommonTooltip>
      <CommonTooltip :content="$t('account.reject')">
        <button
          type="button"
          rounded-full text-sm p2 border-1
          hover:text-red transition-colors
          @click="rejectFollowRequest"
        >
          <span block text-current i-ri:close-fill />
        </button>
      </CommonTooltip>
    </template>
    <template v-else>
      <span text-secondary>
        {{ relationship?.followedBy ? $t('account.authorized') : $t('account.rejected') }}
      </span>
    </template>
  </div>
</template>
