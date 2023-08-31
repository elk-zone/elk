<script setup lang="ts">
import type { mastodon } from 'masto'
import { NOTIFICATION_TYPES } from '~/constants'

const route = useRoute()
const rawFilter = route.params.filter as string
const filter = NOTIFICATION_TYPES.includes(rawFilter)
  ? rawFilter as mastodon.v1.NotificationType
  : undefined
const { t } = useI18n()
useHydratedHead({
  title: () => `${t(`tab.notifications_${filter ?? 'all'}`)} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" :filter="filter" />
</template>
