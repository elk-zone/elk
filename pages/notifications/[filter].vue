<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const filter = $computed(() => {
  if (!isHydrated.value)
    return undefined

  const rawFilter = route.params?.filter
  const actualFilter = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter
  if (isNotification(actualFilter))
    return actualFilter

  return undefined
})

useHydratedHead({
  title: () => `${t(`tab.notifications_${filter ?? 'all'}`)} | ${t('nav.notifications')}`,
})
</script>

<template>
  <TimelineNotifications v-if="isHydrated" :filter="filter" />
</template>
