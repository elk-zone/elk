<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const hideLabel = useHideBottomNavigationLabel()
</script>

<template>
  <NuxtLink to="/hashtags" :aria-label="$t('nav.hashtags')" :active-class="activeClass" flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:hashtag />
    <span v-if="!hideLabel" text-xs>{{ $t('nav.hashtags') }}</span>
  </NuxtLink>
</template>
