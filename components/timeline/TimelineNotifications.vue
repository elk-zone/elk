<script setup lang="ts">
import type { mastodon } from 'masto'

const { filter } = defineProps<{
  filter?: mastodon.v1.NotificationType
}>()

const options = { limit: 30, types: filter ? [filter] : [] }

// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useMastoClient().v1.notifications.list(options)
const stream = useStreaming(client => client.user.notification.subscribe())

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
