<script setup lang="ts">
import type { Notification, Paginator, WsEvents } from 'masto'
import type { GroupedNotifications } from '~/types'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Notification[]>
  stream?: WsEvents
}>()

function groupItems(items: Notification[]): (Notification | GroupedNotifications)[] {
  const results: (Notification | GroupedNotifications)[] = []

  let id = 0
  let followGroup: Notification[] = []

  const bump = () => {
    if (followGroup.length === 1) {
      results.push(followGroup[0])
      followGroup = []
    }
    else if (followGroup.length > 0) {
      results.push({
        id: `grouped-${id++}`,
        type: 'grouped-follow',
        items: followGroup,
      })
      followGroup = []
    }
  }

  for (const item of items) {
    if (item.type === 'follow') {
      followGroup.push(item)
    }
    else {
      bump()
      results.push(item)
    }
  }

  bump()

  return results
}

const { clearNotifications } = useNotifications()
</script>

<template>
  <CommonPaginator :paginator="paginator" :stream="stream" event-type="notification">
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
          border="b base" pt-4
        />
        <NotificationCard
          v-else
          :notification="item"
          hover:bg-active
          border="b base" pt-4
        />
      </template>
    </template>
  </CommonPaginator>
</template>
