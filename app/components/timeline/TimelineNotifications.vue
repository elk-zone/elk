<script setup lang="ts">
import type { mastodon } from 'masto'
import { STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE } from '~/constants'

const { filter } = defineProps<{
  filter?: mastodon.v1.NotificationType
}>()

const route = useRoute()
const lastAccessedNotificationRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE, '')

const options = { limit: 30, types: filter ? [filter] : [] }

// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useMastoClient().v1.notifications.list(options)
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
