<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const useStarFavoriteIcon = usePreferences('useStarFavoriteIcon')

useHydratedHead({
  title: () => t('nav.favourites'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle
        as="router-link" to="/favourites"
        :icon="useStarFavoriteIcon ? 'i-ri:star-line' : 'i-ri:heart-3-line'"
      >
        {{ t('nav.favourites') }}
      </MainTitle>
    </template>

    <TimelineFavourites v-if="isHydrated" />
  </MainContent>
</template>
