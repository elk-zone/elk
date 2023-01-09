<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  status: mastodon.v1.Status
  details?: boolean
  command?: boolean
}>()

const nuxtApp = useNuxtApp()
const focusEditor = inject<typeof noop>('focus-editor', noop)

const { details, command } = $(props)

const {
  status,
  isLoading,
  canReblog,
  toggleBookmark,
  toggleFavourite,
  toggleReblog,
} = $(useStatusActions(props))

const reply = () => {
  if (!checkLogin())
    return
  if (details)
    focusEditor()
  else
    navigateToStatus({ status, focusReply: true })
}
</script>

<template>
  <div flex justify-between>
    <div flex-1>
      <StatusActionButton
        :content="$t('action.reply')"
        :text="status.repliesCount || ''"
        color="text-blue" hover="text-blue" group-hover="bg-blue/10"
        icon="i-ri:chat-1-line"
        :command="command"
        @click="reply"
      >
        <template v-if="status.repliesCount" #text>
          <CommonLocalizedNumber
            keypath="action.reply_count"
            :count="status.repliesCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t('action.boost')"
        :text="status.reblogsCount || ''"
        color="text-green" hover="text-green" group-hover="bg-green/10"
        icon="i-ri:repeat-line"
        active-icon="i-ri:repeat-fill"
        :active="!!status.reblogged"
        :disabled="isLoading.reblogged || !canReblog"
        :command="command"
        @click="toggleReblog()"
      >
        <template v-if="status.reblogsCount" #text>
          <CommonLocalizedNumber
            keypath="action.boost_count"
            :count="status.reblogsCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t('action.favourite')"
        :text="status.favouritesCount || ''"
        color="text-rose" hover="text-rose" group-hover="bg-rose/10"
        icon="i-ri:heart-3-line"
        active-icon="i-ri:heart-3-fill"
        :active="!!status.favourited"
        :disabled="isLoading.favourited"
        :command="command"
        @click="toggleFavourite()"
      >
        <template v-if="status.favouritesCount" #text>
          <CommonLocalizedNumber
            keypath="action.favourite_count"
            :count="status.favouritesCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-none>
      <StatusActionButton
        :content="$t('action.bookmark')"
        color="text-yellow" hover="text-yellow" group-hover="bg-yellow/10"
        icon="i-ri:bookmark-line"
        active-icon="i-ri:bookmark-fill"
        :active="!!status.bookmarked"
        :disabled="isLoading.bookmarked"
        :command="command"
        @click="toggleBookmark()"
      />
    </div>
  </div>
</template>
