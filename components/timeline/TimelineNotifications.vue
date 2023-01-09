<script setup lang="ts">
// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useMasto().v1.notifications.list({ limit: 30 })

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)

const stream = useMasto().v1.stream.streamUser()
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
