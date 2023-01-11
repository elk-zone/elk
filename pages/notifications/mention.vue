<script setup lang="ts">
const { t } = useI18n()
useHeadFixed({
  title: () => isHydrated.value ? `${t('tab.notifications_mention')} | ${t('nav.notifications')}` : '',
})
</script>

<template>
  <TimelineMentions v-if="isMastoInitialised" />
</template>
