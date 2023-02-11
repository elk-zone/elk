<script setup lang="ts">
const { t } = useI18n()
useHeadFixed({
  title: () => `${t('tab.notifications_all')} | ${t('nav.notifications')}`,
})
onMounted(() => {
  useNuxtApp().$trackScroll.registerCustomRoute('/notifications')
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" path="/notifications" />
</template>
