<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const hideLabel = useHideBottomNavigationLabel()
</script>

<template>
  <NuxtLink to="/home" :aria-label="$t('nav.home')" :active-class="activeClass" flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:home-5-line />
    <span v-if="!hideLabel" text-xs>{{ $t('nav.home') }}</span>
  </NuxtLink>
</template>
