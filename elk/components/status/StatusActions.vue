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

const reactionCount = computed(() => status.pleroma.emojiReactions.reduce((acc, curr) => acc += curr.count, status.favouritesCount))

const reaction = computed(() => {
  const reactions = status.favourited ? [{ shortcode: '👍', url: '', staticUrl: '', visibleInPicker: true }] : status.pleroma.emojiReactions.filter(react => react.me).map(r => ({ shortcode: r.name, url: r.url as string, staticUrl: r.url as string, visibleInPicker: true }))
  if (reactions.length > 0)
    return reactions[0]
  return undefined
})

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
        :key="reactionCount"
        :status="status"
        :content="$t(reaction ? 'action.favourited' : 'action.favourite')"
        :text="!getPreferences(userSettings, 'hideReactCount') && reactionCount ? reactionCount : ''"
        color="text-purple"
        hover="text-purple"
        elk-group-hover="bg-purple/10"
        :disabled="isLoading.favourited"
        :command="command"
        :toggle-react="toggleReact"
      >
        <template #icon>
          <div v-if="!reaction" class="i-ri:thumb-up-line" />
          <img v-else-if="reaction.staticUrl" :src="reaction.staticUrl" :alt="reaction.shortcode" class="w-[18px] h-[18px] leading-[18px]">
          <div v-else class="text-[16px] leading-[18px]">
            {{ reaction.shortcode }}
          </div>
        </template>
        <template v-if="reactionCount && !getPreferences(userSettings, 'hideReactCount')" #text>
          <CommonLocalizedNumber
            keypath="action.favourite_count"
            :count="reactionCount"
          />
        </template>
      </StatusActionReact>
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
