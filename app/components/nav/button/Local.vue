<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink group :to="`/${currentServer}/public/local`" :aria-label="$t('nav.local')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:group-2-line />
  </NuxtLink>
</template>
