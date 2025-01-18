<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => `${t('tab.notifications_all')} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" />
</template>
