<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

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
  <div flex justify-between gap-8>
    <RouterLink :to="getStatusPath(status)">
      <StatusActionButton
        :text="status.repliesCount"
        color="text-blue" hover="text-blue" group-hover="bg-blue/10"
        icon="i-ri:chat-3-line"
        tooltip="Replay"
      />
    </RouterLink>

    <StatusActionButton
      :text="status.reblogsCount"
      color="text-green" hover="text-green" group-hover="bg-green/10"
      icon="i-ri:repeat-line"
      active-icon="i-ri:repeat-fill"
      :active="status.reblogged"
      :disabled="isLoading.reblogged"
      tooltip="Boost"
      @click="toggleReblog()"
    />

    <StatusActionButton
      :text="status.favouritesCount"
      color="text-rose" hover="text-rose" group-hover="bg-rose/10"
      icon="i-ri:heart-3-line"
      active-icon="i-ri:heart-3-fill"
      :active="status.favourited"
      :disabled="isLoading.favourited"
      tooltip="Favourite"
      @click="toggleFavourite()"
    />

    <StatusActionButton
      color="text-yellow" hover="text-yellow" group-hover="bg-yellow/10"
      icon="i-ri:bookmark-line"
      active-icon="i-ri:bookmark-fill"
      :active="status.bookmarked"
      :disabled="isLoading.bookmarked"
      tooltip="Bookmark"
      @click="toggleBookmark()"
    />

    <!-- <VDropdown>
      <button flex gap-1 items-center rounded op50 hover="op100 text-purple" group>
        <div rounded-full p2 group-hover="bg-purple/10">
          <div i-ri:share-circle-line />
        </div>
      </button>
    </VDropdown> -->
  </div>
</template>
