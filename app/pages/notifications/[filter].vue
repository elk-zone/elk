<script setup lang="ts">
import type { mastodon } from 'masto'

const route = useRoute()
const { t } = useI18n()

const filter = computed<mastodon.v1.NotificationType | undefined>(() => {
  if (!isHydrated.value)
    return undefined

  const rawFilter = route.params?.filter
  const actualFilter = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter
  if (isNotification(actualFilter))
    return actualFilter

  return undefined
})

useHydratedHead({
  title: () => `${t(`tab.notifications_${filter.value ?? 'all'}`)} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" :filter="filter" />
</template>
