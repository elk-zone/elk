<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const userSettings = useUserSettings()
</script>

<template>
  <NuxtLink
    group
    :to="`/${currentServer}/public/local`"
    :aria-label="$t('nav.local')" :active-class="activeClass"
    flex flex-col items-center place-content-center h-full flex-1 class="coarse-pointer:select-none"
    @click="$scrollToTop"
  >
    <div i-ri:group-2-line />
    <span v-if="!getPreferences(userSettings, 'hideBottomNavLabel')" text-xs>{{ $t('nav.local') }}</span>
  </NuxtLink>
</template>
