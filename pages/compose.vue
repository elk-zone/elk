<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: () => t('nav.compose'),
})
</script>

<template>
  <PublishWidgetFull />
</template>
