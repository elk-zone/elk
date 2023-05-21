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
  <PublishWidgetFull />
</template>
