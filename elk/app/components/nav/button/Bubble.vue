<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink group :to="`/${currentServer}/public/bubble`" :aria-label="$t('nav.bubble')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:hexagon-line />
  </NuxtLink>
</template>
