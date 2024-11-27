<script setup lang="ts">
import TimelineBubble from '~/components/timeline/TimelineBubble.vue'

const { t } = useI18n()

useHydratedHead({
  title: () => t('title.bubble_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public/bubble" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:group-2-line />
        <span>{{ t('title.bubble_timeline') }}</span>
      </NuxtLink>
    </template>

    <TimelineBubble v-if="isHydrated" />
  </MainContent>
</template>
