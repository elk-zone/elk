<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.hashtags'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/hashtags" icon="i-ri:hashtag">
        {{ t('nav.hashtags') }}
      </MainTitle>
    </template>

    <NuxtPage v-if="isHydrated && currentUser" />
  </MainContent>
</template>
