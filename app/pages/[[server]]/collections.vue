<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.collections'),
})
</script>

<template>
  <template v-if="route.name !== 'collection'">
    <MainContent>
      <template #title>
        <MainTitle icon="i-ri:shapes-line">
          {{ t('nav.collections') }}
        </MainTitle>
      </template>
      <NuxtPage v-if="isHydrated" :key="route.fullPath" />
    </MainContent>
  </template>
  <template v-else>
    <NuxtPage v-if="isHydrated" :key="route.fullPath" />
  </template>
</template>
