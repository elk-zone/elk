<script setup lang="ts">
import type { Notification, Paginator, WsEvents } from 'masto'
import type { GroupedAccountLike, NotificationSlot } from '~/types'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Notification[]>
  stream?: WsEvents
}>()

const groupCapacity = Number.MAX_VALUE // No limit
const minFollowGroupSize = 5 // Below this limit, show a profile card for each follow

// Group by type (and status when applicable)
const groupId = (item: Notification): string => {
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

function groupItems(items: Notification[]): NotificationSlot[] {
  const results: NotificationSlot[] = []

  let id = 0
  let currentGroupId = ''
  let currentGroup: Notification[] = []
  const processGroup = () => {
    if (currentGroup.length === 0)
      return

    const group = currentGroup
    currentGroup = []

    // Only group follow notifications when there are too many in a row
    // This normally happens when you transfer an account, if not, show
    // a big profile card for each follow
    if (group[0].type === 'follow' && group.length > minFollowGroupSize) {
      results.push({
        id: `grouped-${id++}`,
        type: `grouped-${group[0].type}`,
        items: group,
      })
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
      likes.sort((a, b) => b.reblog && !a.reblog ? 1 : -1)
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

const { clearNotifications } = useNotifications()
</script>

<template>
  <CommonPaginator :paginator="paginator" :stream="stream" :eager="3" event-type="notification">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="() => { update(); clearNotifications() }">
        {{ $t('timeline.show_new_items', [number]) }}
      </button>
    </template>
    <template #items="{ items }">
      <template v-for="item of groupItems(items)" :key="item.id">
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
