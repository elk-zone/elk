<script setup lang="ts">
const { t } = useI18n()
useHeadFixed({
  title: () => `${t('tab.notifications_mention')} | ${t('nav_side.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isMastoInitialised" />
</template>
