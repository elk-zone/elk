<script setup lang="ts">
import ScheduledStatusCard from '~/components/status/ScheduledStatusCard.vue'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('account.scheduled_posts'),
})

const client = useMastoClient()
const scheduledPosts = await client.v1.scheduledStatuses.list()
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public/pinned" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:calendar-schedule-line />
        <span>{{ t('account.scheduled_posts') }}</span>
      </NuxtLink>
    </template>

    <div v-for="scheduledPost in scheduledPosts" :key="scheduledPost.id" p4>
      <ScheduledStatusCard :scheduled-status="scheduledPost" />
    </div>
  </MainContent>
</template>
