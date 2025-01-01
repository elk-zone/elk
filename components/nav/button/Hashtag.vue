<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const userSettings = useUserSettings()
</script>

<template>
  <NuxtLink to="/hashtags" :aria-label="$t('nav.hashtags')" :active-class="activeClass" flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:hashtag />
    <span v-if="!getPreferences(userSettings, 'hideBottomNavLabel')" text-xs>{{ $t('nav.hashtags') }}</span>
  </NuxtLink>
</template>
