<script setup lang="ts">
const paginator = useMasto().trends.getStatuses()

const { t } = useI18n()

useHead({
  title: () => t('nav_side.explore'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:hashtag h-6 mr-1 /><span>{{ t('nav_side.explore') }}</span>
    </template>

    <slot>
      <!-- TODO: Tabs for trending statuses, tags, and links -->
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
