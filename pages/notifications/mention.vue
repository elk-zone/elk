<script setup lang="ts">
const { t } = useI18n()
useHeadFixed({
  title: () => `${t('tab.notifications_mention')} | ${t('nav.notifications')}`,
})

onMounted(() => {
  useNuxtApp().$trackScroll.registerCustomRoute('/notification/mention')
})
</script>

<template>
  <TimelineMentions v-if="isHydrated" path="/notifications/mention" />
</template>
