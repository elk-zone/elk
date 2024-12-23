<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink
    to="/conversations" :aria-label="$t('nav.conversations')"
    :active-class="activeClass" flex flex-row items-center place-content-center h-full
    flex-1 class="coarse-pointer:select-none" @click="$scrollToTop"
  >
    <div i-ri:at-line />
  </NuxtLink>
</template>
