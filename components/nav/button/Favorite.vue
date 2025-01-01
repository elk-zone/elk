<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const userSettings = useUserSettings()
const hideLabel = getPreferences(userSettings.value, 'hideBottomNavLabel')
</script>

<template>
  <NuxtLink to="/favourites" :aria-label="$t('nav.favourites')" :active-class="activeClass" flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:heart-line />
    <span v-if="!hideLabel" text-xs>{{ $t('nav.favourites') }}</span>
  </NuxtLink>
</template>
