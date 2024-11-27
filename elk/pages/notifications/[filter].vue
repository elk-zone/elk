<script setup lang="ts">
import type { akkoma } from 'akko'

const route = useRoute()
const { t } = useI18n()

const filter = computed<akkoma.v1.NotificationType | undefined>(() => {
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
