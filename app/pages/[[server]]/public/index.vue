<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('title.federated_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/public" icon="i-ri:earth-line">
        {{ $t('title.federated_timeline') }}
      </MainTitle>
    </template>

    <TimelinePublic v-if="isHydrated" />
  </MainContent>
</template>
