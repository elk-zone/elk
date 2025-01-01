<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const userSettings = useUserSettings()
const hideLabel = getPreferences(userSettings.value, 'hideBottomNavLabel')
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
    <span v-if="!hideLabel" text-xs>{{ $t('nav.local') }}</span>
  </NuxtLink>
</template>
