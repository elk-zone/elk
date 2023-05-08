<script setup lang="ts">
const { t } = useI18n()
useHydratedHead({
  title: () => `${t('tab.notifications_mention')} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineMentions v-if="isHydrated" />
</template>
