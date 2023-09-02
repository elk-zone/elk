<script setup lang="ts">
import type { mastodon } from 'masto'
import { NOTIFICATION_TYPES } from '~/constants'

const route = useRoute()
const { t } = useI18n()

const filter = $computed(() => {
  if (!isHydrated.value)
    return undefined

  const rawFilter = route.params?.filter
  if (!rawFilter)
    return undefined

  if (['mention', ...NOTIFICATION_TYPES].includes(Array.isArray(rawFilter) ? rawFilter[0] : rawFilter))
    return rawFilter as mastodon.v1.NotificationType

  return undefined
})

useHydratedHead({
  title: () => `${t(`tab.notifications_${filter ?? 'all'}`)} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" :filter="filter" />
</template>
