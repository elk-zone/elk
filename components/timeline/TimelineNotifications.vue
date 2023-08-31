<script setup lang="ts">
export type NotificationType = 'mention' | 'reblog' | 'favourite' | 'follow'
const { filter } = defineProps<{
  filter?: NotificationType
}>()

const options = { limit: 30, types: filter ? [filter] : [] }

// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useMastoClient().v1.notifications.list(options)
const stream = useStreaming(client => client.v1.stream.streamUser())

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
