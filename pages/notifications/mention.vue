<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = useMasto().notifications.iterate({ limit: 30, types: ['mention'] })

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)

const stream = await useMasto().stream.streamUser()

useHeadFixed({
  title: () => t('nav_side.notifications'),
})
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
