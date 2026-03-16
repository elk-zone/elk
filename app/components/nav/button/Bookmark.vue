<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink to="/bookmarks" :aria-label="$t('nav.bookmarks')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:bookmark-line />
  </NuxtLink>
</template>
