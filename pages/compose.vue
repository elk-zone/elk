<script setup lang="ts">
const { t } = useI18n()
useHeadFixed({
  title: () => t('nav.compose'),
})
</script>

<template>
  <PublishWidgetFull />
</template>
