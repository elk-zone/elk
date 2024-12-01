<script setup lang="ts">
import type { akkoma } from 'akko'

const props = defineProps<{
  status: akkoma.v1.Status
  details?: boolean
  command?: boolean
}>()

const focusEditor = inject<typeof noop>('focus-editor', noop)

const { details, command } = props // TODO

const userSettings = useUserSettings()

const {
  status,
  isLoading,
  canReblog,
  toggleBookmark,
  toggleFavourite,
  toggleReblog,
} = useStatusActions(props)

const reactionCount = computed(() => status.value.emojiReactions.reduce((acc, curr) => acc += curr.count, status.value.favouritesCount))

function reply() {
  if (!checkLogin())
    return
  if (details)
    focusEditor()
  else
    navigateToStatus({ status: status.value, focusReply: true })
}
</script>

<template>
  <div flex justify-between items-center class="status-actions">
    <div flex-1>
      <StatusActionButton
        :content="$t('action.reply')"
        :text="!getPreferences(userSettings, 'hideReplyCount') && status.repliesCount || ''"
        color="text-blue" hover="text-blue" elk-group-hover="bg-blue/10"
        icon="i-ri:chat-1-line"
        :command="command"
        @click="reply"
      >
        <template v-if="status.repliesCount && !getPreferences(userSettings, 'hideReplyCount')" #text>
          <CommonLocalizedNumber
            keypath="action.reply_count"
            :count="status.repliesCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t(status.reblogged ? 'action.boosted' : 'action.boost')"
        :text="!getPreferences(userSettings, 'hideBoostCount') && status.reblogsCount ? status.reblogsCount : ''"
        color="text-green" hover="text-green" elk-group-hover="bg-green/10"
        icon="i-ri:repeat-line"
        active-icon="i-ri:repeat-fill"
        inactive-icon="i-tabler:repeat-off"
        :active="!!status.reblogged"
        :disabled="isLoading.reblogged || !canReblog"
        :command="command"
        @click="toggleReblog()"
      >
        <template v-if="status.reblogsCount && !getPreferences(userSettings, 'hideBoostCount')" #text>
          <CommonLocalizedNumber
            keypath="action.boost_count"
            :count="status.reblogsCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t(status.favourited ? 'action.favourited' : 'action.favourite')"
        :text="!getPreferences(userSettings, 'hideFavoriteCount') && status.favouritesCount ? status.favouritesCount : ''"
        color="text-purple"
        hover="text-purple"
        elk-group-hover="bg-purple/10"
        icon="i-ri:thumb-up-line"
        active-icon="i-ri:thumb-up-fill"
        :active="!!status.favourited"
        :disabled="isLoading.favourited"
        :command="command"
        @click="toggleFavourite()"
      >
        <template v-if="reactionCount && !getPreferences(userSettings, 'hideFavoriteCount')" #text>
          <CommonLocalizedNumber
            keypath="action.favourite_count"
            :count="reactionCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-none>
      <StatusActionButton
        :content="$t(status.bookmarked ? 'action.bookmarked' : 'action.bookmark')"
        color="text-yellow"
        hover="text-yellow"
        elk-group-hover="bg-yellow/10"
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
