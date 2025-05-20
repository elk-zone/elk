<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const { status, isLoading, canReblog, toggleBookmark, toggleReact, toggleReblog, details, command } = defineProps<{
  status: akkoma.v1.Status
  isLoading: { favourited: boolean, bookmarked: boolean, reblogged: boolean }
  canReblog: boolean
  toggleBookmark: () => void
  toggleReblog: () => void
  toggleReact: (e: akkoma.v1.CustomEmoji) => void
  details?: boolean
  command?: boolean
}>()

const focusEditor = inject<typeof noop>('focus-editor', noop)

const userSettings = useUserSettings()

const { draftItems } = useDraft('home')

function quote() {
  draftItems.value = [getDefaultDraftItem({ quoteId: status.id })]
  navigateTo('/compose')
}

function reply() {
  if (!checkLogin())
    return
  if (details)
    focusEditor()
  else
    navigateToStatus({ status, focusReply: true })
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
      <StatusActionReblog
        :can-reblog="canReblog"
        :command="command"
        :is-loading="isLoading"
        :status="status"
        :toggle-reblog="toggleReblog"
        :quote="quote"
      />
    </div>

    <div flex-1>
      <StatusActionReact
        :status="status"
        :is-loading="isLoading"
        :command="command"
        :toggle-react="toggleReact"
      />
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
