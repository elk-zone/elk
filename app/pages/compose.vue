<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.compose'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/compose" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:quill-pen-line />
        <span>{{ $t('nav.compose') }}</span>
      </NuxtLink>
    </template>
    <PublishWidgetFull />
  </MainContent>
</template>
