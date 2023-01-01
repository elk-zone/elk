<script setup lang="ts">
import type { Status } from 'masto'

const props = defineProps<{
  status: Status
  details?: boolean
  command?: boolean
}>()

const focusEditor = inject<typeof noop>('focus-editor', noop)

const { details, command } = $(props)

const {
  status,
  isLoading,
  toggleBookmark,
  toggleFavourite,
  toggleReblog,
} = $(useStatusActions(props))

const { formatHumanReadableNumber, formatNumber, forSR } = useHumanReadableNumber()

const replyCount = $computed(() => formatNumber(status.repliesCount))
const replyCountHR = $computed(() => formatHumanReadableNumber(status.repliesCount))
const replyCountSR = $computed(() => forSR(status.repliesCount))
const rebloggedCount = $computed(() => formatNumber(status.repliesCount))
const rebloggedCountHR = $computed(() => formatHumanReadableNumber(status.repliesCount))
const rebloggedCountSR = $computed(() => forSR(status.repliesCount))
const favouritesCount = $computed(() => formatNumber(status.favouritesCount))
const favouritesCountHR = $computed(() => formatHumanReadableNumber(status.favouritesCount))
const favouritesCountSR = $computed(() => forSR(status.favouritesCount))

const reply = () => {
  if (!checkLogin())
    return
  if (details) {
    focusEditor()
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
      >
        <template v-if="status.repliesCount" #text>
          <i18n-t keypath="action.reply_count" :plural="status.repliesCount">
            <CommonTooltip v-if="replyCountSR" :content="replyCount" placement="bottom">
              <span aria-hidden="true">{{ replyCountHR }}</span>
              <span sr-only>{{ replyCount }}</span>
            </CommonTooltip>
            <span v-else>{{ replyCountHR }}</span>
          </i18n-t>
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
        :active="status.reblogged"
        :disabled="isLoading.reblogged"
        :command="command"
        @click="toggleReblog()"
      >
        <template v-if="status.reblogsCount" #text>
          <i18n-t keypath="action.boost_count" :plural="status.reblogsCount">
            <CommonTooltip v-if="rebloggedCountSR" :content="rebloggedCount" placement="bottom">
              <span aria-hidden="true">{{ rebloggedCountHR }}</span>
              <span sr-only>{{ rebloggedCount }}</span>
            </CommonTooltip>
            <span v-else>{{ rebloggedCountHR }}</span>
          </i18n-t>
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
        :active="status.favourited"
        :disabled="isLoading.favourited"
        :command="command"
        @click="toggleFavourite()"
      >
        <template v-if="status.favouritesCount" #text>
          <i18n-t keypath="action.favourite_count" :plural="status.favouritesCount">
            <CommonTooltip v-if="favouritesCountSR" :content="favouritesCount" placement="bottom">
              <span aria-hidden="true">{{ favouritesCountHR }}</span>
              <span sr-only>{{ favouritesCount }}</span>
            </CommonTooltip>
            <span v-else>{{ favouritesCountHR }}</span>
          </i18n-t>
        </template>
      </StatusActionButton>
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
