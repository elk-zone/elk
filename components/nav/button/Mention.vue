<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const userSettings = useUserSettings()
const hideLabel = getPreferences(userSettings.value, 'hideBottomNavLabel')
</script>

<template>
  <NuxtLink
    to="/conversations"
    :aria-label="$t('nav.conversations')"
    :active-class="activeClass" flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none"
    @click="$scrollToTop"
  >
    <div i-ri:at-line />
    <span v-if="!hideLabel" text-xs>{{ $t('nav.conversations') }}</span>
  </NuxtLink>
</template>
