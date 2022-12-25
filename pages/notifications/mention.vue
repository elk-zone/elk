<script setup lang="ts">
const { t } = useI18n()

const masto = useMasto()
// Default limit is 20 notifications, and servers are normally caped to 30
const paginator = masto.notifications.iterate({ limit: 30, types: ['mention'] })

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)

const stream = await masto.stream.streamUser()

useHeadFixed({
  title: () => `${t('tab.notifications_mention')} | ${t('nav_side.notifications')}`,
})
</script>

<template>
  <NotificationPaginator v-bind="{ paginator, stream }" />
</template>
