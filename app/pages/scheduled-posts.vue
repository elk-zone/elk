<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.scheduled_posts'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/scheduled-posts" icon="i-ri:calendar-schedule-line">
        {{ t('nav.scheduled_posts') }}
      </MainTitle>
    </template>

    <TimelineScheduledPosts v-if="isHydrated" />
  </MainContent>
</template>
