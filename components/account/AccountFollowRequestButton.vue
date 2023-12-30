<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, ...props } = defineProps<{
  account: mastodon.v1.Account
  relationship?: mastodon.v1.Relationship
}>()
const relationship = $computed(() => props.relationship || useRelationship(account).value)
const { client } = $(useMasto())

async function authorizeFollowRequest() {
  relationship!.requestedBy = false
  relationship!.followedBy = true
  try {
    const newRel = await client.v1.followRequests.authorize(account.id)
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    relationship!.requestedBy = true
    relationship!.followedBy = false
  }
}

async function rejectFollowRequest() {
  relationship!.requestedBy = false
  try {
    const newRel = await client.v1.followRequests.reject(account.id)
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    relationship!.requestedBy = true
  }
}
</script>

<template>
  <div flex gap-4>
    <template v-if="relationship?.requestedBy">
      <CommonTooltip :content="$t('account.authorize')" no-auto-focus>
        <button
          type="button"
          rounded-full text-sm p2 border-1
          hover:text-green transition-colors
          @click="authorizeFollowRequest"
        >
          <span block text-current i-ri:check-fill />
        </button>
      </CommonTooltip>
      <CommonTooltip :content="$t('account.reject')" no-auto-focus>
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
