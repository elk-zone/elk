<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.scheduled_statuses'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/scheduled-statuses" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:calendar-schedule-line />
        <span>{{ t('nav.scheduled_statuses') }}</span>
      </NuxtLink>
    </template>

    <TimelineScheduledStatuses v-if="isHydrated" />
  </MainContent>
</template>
