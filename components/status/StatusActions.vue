<script setup lang="ts">
import type { Status } from 'masto'
import AccountInfo from '../account/AccountInfo.vue'

const { status } = defineProps<{
  status: Status
}>()

const masto = await useMasto()

// Use different states to let the user press different actions right after the other
const isLoading = $ref({ reblogged: false, favourited: false, bookmarked: false })
async function toggleStatusAction(action: 'reblogged' | 'favourited' | 'bookmarked', newStatus: Promise<Status>) {
  // Optimistic update
  Object.assign(status, { [action]: !status[action] })
  try {
    isLoading[action] = true
    Object.assign(status, await newStatus)
  }
  finally {
    isLoading[action] = false
  }
}

const toggleReblog = () => toggleStatusAction(
  'reblogged',
  masto.statuses[status.reblogged ? 'unreblog' : 'reblog'](status.id),
)

const toggleFavourite = () => toggleStatusAction(
  'favourited',
  masto.statuses[status.favourited ? 'unfavourite' : 'favourite'](status.id),
)

const toggleBookmark = () => toggleStatusAction(
  'bookmarked',
  masto.statuses[status.bookmarked ? 'unbookmark' : 'bookmark'](status.id),
)
</script>

<template>
  <div flex gap-8>
    <RouterLink flex gap-1 items-center w-full rounded op75 hover="op100 text-blue" group :to="`/@${status.account.acct}/${status.id}`">
      <div rounded-full p2 group-hover="bg-blue/10">
        <div i-ri:chat-3-line />
      </div>
      <span v-if="status.repliesCount">{{ status.repliesCount }}</span>
    </RouterLink>
    <button
      flex gap-1 items-center w-full rounded op75 hover="op100 text-green" group
      :class="(status.reblogged ? 'text-green op100' : 'op75') + (isLoading.reblogged ? ' pointer-events-none' : '')"
      @click="toggleReblog()"
    >
      <div rounded-full p2 group-hover="bg-green/10">
        <div :class="status.reblogged ? 'i-ri:repeat-fill' : 'i-ri:repeat-line'" />
      </div>
      <span v-if="status.reblogsCount">{{ status.reblogsCount }}</span>
    </button>
    <button
      flex gap-1 items-center w-full rounded hover="op100 text-rose" group
      :class="status.favourited ? 'text-rose op100' : 'op75'"
      @click="toggleFavourite()"
    >
      <div rounded-full p2 group-hover="bg-rose/10">
        <div :class="(status.favourited ? 'i-ri:heart-3-fill' : 'i-ri:heart-3-line') + (isLoading.favourited ? ' pointer-events-none' : '')" />
      </div>
      <span v-if="status.favouritesCount">{{ status.favouritesCount }}</span>
    </button>
    <button
      flex gap-1 items-center w-full rounded hover="op100 text-yellow" group
      :class="status.bookmarked ? 'text-yellow op100' : 'op75'"
      @click="toggleBookmark()"
    >
      <div rounded-full p2 group-hover="bg-rose/10">
        <div :class="(status.bookmarked ? 'i-ri:bookmark-fill' : 'i-ri:bookmark-line') + (isLoading.bookmarked ? ' pointer-events-none' : '')" />
      </div>
    </button>
    <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
      <div rounded-full p2 group-hover="bg-purple/10">
        <div i-ri:share-circle-line />
      </div>
    </button>
  </div>
</template>
