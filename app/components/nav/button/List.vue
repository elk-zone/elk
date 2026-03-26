<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink
    to="/lists"
    :aria-label="$t('nav.lists')"
    :active-class="activeClass"
    flex flex-row items-center place-content-center h-full flex-1
    class="coarse-pointer:select-none" @click="$scrollToTop"
  >
    <div i-ri:list-check />
  </NuxtLink>
</template>
