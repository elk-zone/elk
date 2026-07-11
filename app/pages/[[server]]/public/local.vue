<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('title.local_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/public/local" icon="i-ri:group-2-line">
        {{ $t('title.local_timeline') }}
      </MainTitle>
    </template>

    <TimelinePublicLocal v-if="isHydrated" />
  </MainContent>
</template>
