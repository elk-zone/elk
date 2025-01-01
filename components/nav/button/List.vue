<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const userSettings = useUserSettings()
</script>

<template>
  <NuxtLink
    to="/lists"
    :aria-label="$t('nav.lists')"
    :active-class="activeClass"
    flex flex-col items-center place-content-center h-full flex-1
    class="coarse-pointer:select-none" @click="$scrollToTop"
  >
    <div i-ri:list-check />
    <span v-if="!getPreferences(userSettings, 'hideBottomNavLabel')" text-xs>{{ $t('nav.lists') }}</span>
  </NuxtLink>
</template>
