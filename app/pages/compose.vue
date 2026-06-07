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
      <MainTitle as="router-link" to="/compose" icon="i-ri:quill-pen-line">
        {{ $t('nav.compose') }}
      </MainTitle>
    </template>
    <PublishWidgetFull />
  </MainContent>
</template>
