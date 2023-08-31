<script setup lang="ts">
import type { NotificationType } from 'components/timeline/TimelineNotifications.vue'

const { t } = useI18n()
useHydratedHead({
  title: () => `${t('tab.notifications_all')} | ${t('nav.notifications')}`,
})

const route = useRoute()
const rawFilter = route.params.filter as string
const filter = ['mention', 'reblog', 'favourite', 'follow'].includes(rawFilter)
  ? rawFilter as NotificationType
  : undefined
</script>

<template>
  <TimelineNotifications v-if="isHydrated" :filter="filter" />
</template>
