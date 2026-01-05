<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink to="/scheduled-posts" :aria-label="$t('nav.scheduled_posts')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:calendar-schedule-line />
  </NuxtLink>
</template>
