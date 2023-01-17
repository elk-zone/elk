<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav.following_tags'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span timeline-title-style>{{ $t('nav.following_tags') }}</span>
    </template>

    <TimelineFollowingTags v-if="isHydrated" />
  </MainContent>
</template>
