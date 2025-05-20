<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'
import { STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE } from '~/constants'

const { filter } = defineProps<{
  filter?: akkoma.v1.NotificationType
}>()

const route = useRoute()
const lastAccessedNotificationRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE, '')

const akkomaFilter = computed(() => {
  if (!filter)
    return []
  return (filter === 'favourite' || filter === 'pleroma:emoji_reaction' ? ['favourite', 'pleroma:emoji_reaction'] : [filter]) as akkoma.v1.NotificationType[]
})

const options: akkoma.rest.v1.ListNotificationsParams = { limit: 30, includeTypes: akkomaFilter.value }

// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useAkkoClient().v1.notifications.list(options)
const stream = useStreaming(client => client.user.notification.subscribe())

lastAccessedNotificationRoute.value = route.path.replace(/\/notifications\/?/, '')

const { clearNotifications } = useNotifications()
onActivated(() => {
  clearNotifications()
  lastAccessedNotificationRoute.value = route.path.replace(/\/notifications\/?/, '')
})
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
