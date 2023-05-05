<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const userSettings = useUserSettings()

useHydratedHead({
  title: () => t('nav.favourites'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/favourites" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div :class="getPreferences(userSettings, 'useStarFavoriteIcon') ? 'i-ri:star-line' : 'i-ri:heart-3-line'" />
        <span>{{ t('nav.favourites') }}</span>
      </NuxtLink>
    </template>

    <TimelineFavourites v-if="isHydrated" />
  </MainContent>
</template>
