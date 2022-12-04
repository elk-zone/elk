<script setup lang="ts">
const paginator = useMasto().trends.getStatuses()

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav_side.explore'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/explore" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:hashtag />
        <span>{{ t('nav_side.explore') }}</span>
      </NuxtLink>
    </template>

    <slot>
      <!-- TODO: Tabs for trending statuses, tags, and links -->
      <TimelinePaginator :paginator="paginator" context="public" />
    </slot>
  </MainContent>
</template>
