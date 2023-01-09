<script setup lang="ts">
import { mastodon } from 'masto'
import type { Paginator, WsEvents } from 'masto'
// type used in <template>
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { GroupedAccountLike, GroupedLikeNotifications, GroupedNotifications, NotificationSlot } from '~/types'

const { paginator, stream } = defineProps<{
  paginator: Paginator<NotificationSlot[], mastodon.v1.ListNotificationsParams>
  stream?: Promise<WsEvents>
}>()

const groupCapacity = Number.MAX_VALUE // No limit

// Group by type (and status when applicable)
const groupId = (item: mastodon.v1.Notification): string => {
  // If the update is related to an status, group notifications from the same account (boost + favorite the same status)
  const id = item.status
    ? {
        status: item.status?.id,
        type: (item.type === 'reblog' || item.type === 'favourite') ? 'like' : item.type,
      }
    : {
        type: item.type,
      }
  return JSON.stringify(id)
}

function groupItems(items: mastodon.v1.Notification[]): NotificationSlot[] {
  const results: NotificationSlot[] = []

  let id = 0
  let currentGroupId = ''
  let currentGroup: mastodon.v1.Notification[] = []
  const processGroup = () => {
    if (currentGroup.length === 0)
      return

    const group = currentGroup
    currentGroup = []

    // Only group follow notifications when there are too many in a row
    // This normally happens when you transfer an account, if not, show
    // a big profile card for each follow
    if (group[0].type === 'follow') {
      const toGroup = []
      for (const item of group) {
        const hasHeader = !item.account.header.endsWith('/original/missing.png')
        if (hasHeader && (item.account.followersCount > 250 || (group.length === 1 && item.account.followersCount > 25)))
          results.push(item)
        else
          toGroup.push(item)
      }
      if (toGroup.length > 0) {
        results.push({
          id: `grouped-${id++}`,
          type: `grouped-${group[0].type}`,
          items: toGroup,
        })
      }
      return
    }

    const { status } = group[0]
    if (status && group.length > 1 && (group[0].type === 'reblog' || group[0].type === 'favourite')) {
      // All notifications in these group are reblogs or favourites of the same status
      const likes: GroupedAccountLike[] = []
      for (const notification of group) {
        let like = likes.find(like => like.account.id === notification.account.id)
        if (!like) {
          like = { account: notification.account }
          likes.push(like)
        }
        like[notification.type === 'reblog' ? 'reblog' : 'favourite'] = notification
      }
      likes.sort((a, b) => a.reblog ? !b.reblog || (a.favourite && !b.favourite) ? -1 : 0 : 0)
      results.push({
        id: `grouped-${id++}`,
        type: 'grouped-reblogs-and-favourites',
        status,
        likes,
      })
      return
    }

    results.push(...group)
  }

  for (const item of items) {
    const itemId = groupId(item)
    // Finalize group if it already has too many notifications
    if (currentGroupId !== itemId || currentGroup.length >= groupCapacity)
      processGroup()

    currentGroup.push(item)
    currentGroupId = itemId
  }
  // Finalize remaining groups
  processGroup()

  return results
}

function preprocess(items: NotificationSlot[]): NotificationSlot[] {
  const flattenedNotifications: mastodon.v1.Notification[] = []
  for (const item of items) {
    if (item.type === 'grouped-reblogs-and-favourites') {
      const group = item as GroupedLikeNotifications
      for (const like of group.likes) {
        if (like.reblog)
          flattenedNotifications.push(like.reblog)
        if (like.favourite)
          flattenedNotifications.push(like.favourite)
      }
    }
    else if (item.type.startsWith('grouped-')) {
      flattenedNotifications.push(...(item as GroupedNotifications).items)
    }
    else {
      flattenedNotifications.push(item as mastodon.v1.Notification)
    }
  }
  return groupItems(flattenedNotifications)
}

const { clearNotifications } = useNotifications()
const { formatNumber } = useHumanReadableNumber()
</script>

<template>
  <CommonPaginator :paginator="paginator" :preprocess="preprocess" :stream="stream" :eager="3" event-type="notification">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="() => { update(); clearNotifications() }">
        {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
      </button>
    </template>
    <template #items="{ items }">
      <template v-for="item of items" :key="item.id">
        <NotificationGroupedFollow
          v-if="item.type === 'grouped-follow'"
          :items="item"
          border="b base"
        />
        <NotificationGroupedLikes
          v-else-if="item.type === 'grouped-reblogs-and-favourites'"
          :group="item as GroupedLikeNotifications"
          border="b base"
        />
        <NotificationCard
          v-else
          :notification="item as mastodon.v1.Notification"
          hover:bg-active
          border="b base"
        />
      </template>
    </template>
  </CommonPaginator>
</template>
