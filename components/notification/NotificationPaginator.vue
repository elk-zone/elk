<script setup lang="ts">
import type { mastodon } from 'masto'
import type { GroupedAccountLike, NotificationSlot } from '~/types'
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'

const { paginator, stream } = defineProps<{
  paginator: mastodon.Paginator<mastodon.v1.Notification[], mastodon.rest.v1.ListNotificationsParams>
  stream?: mastodon.streaming.Subscription
}>()

const virtualScroller = false // TODO: fix flickering issue with virtual scroll

const groupCapacity = Number.MAX_VALUE // No limit

const includeNotificationTypes: mastodon.v1.NotificationType[] = ['update', 'mention', 'poll', 'status']

let id = 0

function includeNotificationsForStatusCard({ type, status }: mastodon.v1.Notification) {
  // Exclude update, mention, pool and status notifications without the status entry:
  // no makes sense to include them
  // Those notifications will be shown using StatusCard SFC:
  // check NotificationCard SFC L68 and L81 => :status="notification.status!"
  return status || !includeNotificationTypes.includes(type)
}

// Group by type (and status when applicable)
function groupId(item: mastodon.v1.Notification): string {
  // If the update is related to a status, group notifications from the same account (boost + favorite the same status)
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

function hasHeader(account: mastodon.v1.Account) {
  return !account.header.endsWith('/original/missing.png')
}

function groupItems(items: mastodon.v1.Notification[]): NotificationSlot[] {
  const results: NotificationSlot[] = []

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
      // Order group by followers count
      const processedGroup = [...group]
      processedGroup.sort((a, b) => {
        const aHasHeader = hasHeader(a.account)
        const bHasHeader = hasHeader(b.account)
        if (bHasHeader && !aHasHeader)
          return 1
        if (aHasHeader && !bHasHeader)
          return -1
        return b.account.followersCount - a.account.followersCount
      })

      if (processedGroup.length > 0 && hasHeader(processedGroup[0].account))
        results.push(processedGroup.shift()!)

      if (processedGroup.length === 1 && hasHeader(processedGroup[0].account))
        results.push(processedGroup.shift()!)

      if (processedGroup.length > 0) {
        results.push({
          id: `grouped-${id++}`,
          type: 'grouped-follow',
          items: processedGroup,
        })
      }
      return
    }
    else if (group.length && (group[0].type === 'reblog' || group[0].type === 'favourite')) {
      if (!group[0].status) {
        // Ignore favourite or reblog if status is null, sometimes the API is sending these
        // notifications
        return
      }
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
      likes.sort((a, b) => a.reblog
        ? (!b.reblog || (a.favourite && !b.favourite))
            ? -1
            : 0
        : 0)
      results.push({
        id: `grouped-${id++}`,
        type: 'grouped-reblogs-and-favourites',
        status: group[0].status,
        likes,
      })
      return
    }

    results.push(...group)
  }

  for (const item of items.filter(includeNotificationsForStatusCard)) {
    const itemId = groupId(item)
    // Finalize the group if it already has too many notifications
    if (currentGroupId !== itemId || currentGroup.length >= groupCapacity)
      processGroup()

    currentGroup.push(item)
    currentGroupId = itemId
  }
  // Finalize remaining groups
  processGroup()

  return results
}

function removeFiltered(items: mastodon.v1.Notification[]): mastodon.v1.Notification[] {
  return items.filter(item => !item.status?.filtered?.find(
    filter => filter.filter.filterAction === 'hide' && filter.filter.context.includes('notifications'),
  ))
}

function preprocess(items: NotificationSlot[]): NotificationSlot[] {
  const flattenedNotifications: mastodon.v1.Notification[] = []
  for (const item of items) {
    if (item.type === 'grouped-reblogs-and-favourites') {
      const group = item
      for (const like of group.likes) {
        if (like.reblog)
          flattenedNotifications.push(like.reblog)
        if (like.favourite)
          flattenedNotifications.push(like.favourite)
      }
    }
    else if (item.type === 'grouped-follow') {
      flattenedNotifications.push(...item.items)
    }
    else {
      flattenedNotifications.push(item)
    }
  }
  return groupItems(removeFiltered(flattenedNotifications))
}

const { clearNotifications } = useNotifications()
const { formatNumber } = useHumanReadableNumber()
</script>

<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <CommonPaginator
    :paginator="paginator"
    :preprocess="preprocess"
    :stream="stream"
    eventType="notification"
    :virtualScroller="virtualScroller"
  >
    <template #updater="{ number, update }">
      <button id="elk_show_new_items" py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="() => { update(); clearNotifications() }">
        {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
      </button>
    </template>
    <template #default="{ item, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="div">
          <NotificationGroupedFollow
            v-if="item.type === 'grouped-follow'"
            :items="item"
            border="b base"
          />
          <NotificationGroupedLikes
            v-else-if="item.type === 'grouped-reblogs-and-favourites'"
            :group="item"
            border="b base"
          />
          <NotificationCard
            v-else
            :notification="item"
            hover:bg-active
            border="b base"
          />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <NotificationGroupedFollow
          v-if="item.type === 'grouped-follow'"
          :items="item"
          border="b base"
        />
        <NotificationGroupedLikes
          v-else-if="item.type === 'grouped-reblogs-and-favourites'"
          :group="item"
          border="b base"
        />
        <NotificationCard
          v-else
          :notification="item"
          hover:bg-active
          border="b base"
        />
      </template>
    </template>
  </CommonPaginator>
</template>
