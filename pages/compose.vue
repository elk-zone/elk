<script setup lang="ts">
const { t } = useI18n()
useHydratedHead({
  title: () => t('nav.compose'),
})
</script>

<template>
  <PublishWidgetFull />
</template>
