<script setup lang="ts">
import type { mastodon } from 'masto'

const route = useRoute()
const filter = route.params.filter as mastodon.v1.NotificationType | undefined
const { t } = useI18n()
useHydratedHead({
  title: () => `${t(`tab.notifications_${filter ?? 'all'}`)} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" :filter="filter" />
</template>
