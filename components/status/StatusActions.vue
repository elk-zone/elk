<script setup lang="ts">
import type { Status } from 'masto'

const props = defineProps<{
  status: Status
  details?: boolean
  command?: boolean
}>()

const { details, command } = $(props)

const {
  status,
  isLoading,
  toggleBookmark,
  toggleFavourite,
  toggleReblog,
} = $(useStatusActions(props))

const reply = () => {
  if (!checkLogin())
    return
  if (details) {
    // TODO focus to editor
  }
  else {
    const { key, draft } = getReplyDraft(status)
    openPublishDialog(key, draft())
  }
}
</script>

<template>
  <div flex justify-between>
    <div flex-1>
      <StatusActionButton
        :content="$t('action.reply')"
        :text="status.repliesCount || ''"
        color="text-blue" hover="text-blue" group-hover="bg-blue/10"
        icon="i-ri:chat-3-line"
        :command="command"
        @click="reply"
      />
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t('action.boost')"
        :text="status.reblogsCount || ''"
        color="text-green" hover="text-green" group-hover="bg-green/10"
        icon="i-ri:repeat-line"
        active-icon="i-ri:repeat-fill"
        :active="status.reblogged"
        :disabled="isLoading.reblogged"
        :command="command"
        @click="toggleReblog()"
      />
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t('action.favourite')"
        :text="status.favouritesCount || ''"
        color="text-rose" hover="text-rose" group-hover="bg-rose/10"
        icon="i-ri:heart-3-line"
        active-icon="i-ri:heart-3-fill"
        :active="status.favourited"
        :disabled="isLoading.favourited"
        :command="command"
        @click="toggleFavourite()"
      />
    </div>

    <div flex-none>
      <StatusActionButton
        :content="$t('action.bookmark')"
        color="text-yellow" hover="text-yellow" group-hover="bg-yellow/10"
        icon="i-ri:bookmark-line"
        active-icon="i-ri:bookmark-fill"
        :active="status.bookmarked"
        :disabled="isLoading.bookmarked"
        :command="command"
        @click="toggleBookmark()"
      />
    </div>
  </div>
</template>
