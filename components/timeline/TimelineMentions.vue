<script setup lang="ts">
// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useMastoClient().v1.notifications.list({ limit: 30, types: ['mention'] })
const stream = $(useStreaming(client => client.v1.stream.streamUser()))

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
