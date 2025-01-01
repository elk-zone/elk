<script setup lang="ts">
import { STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE } from '~/constants'

defineProps<{
  activeClass: string
}>()

const lastAccessedExploreRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE, '')

const userSettings = useUserSettings()
const hideLabel = getPreferences(userSettings.value, 'hideBottomNavLabel')
</script>

<template>
  <NuxtLink
    :to="`/${currentServer}/explore/${lastAccessedExploreRoute}`"
    :aria-label="$t('nav.explore')"
    :active-class="activeClass"
    flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none"
    @click="$scrollToTop"
  >
    <div i-ri:compass-3-line />
    <span v-if="!hideLabel" text-xs>{{ $t('nav.explore') }}</span>
  </NuxtLink>
</template>
