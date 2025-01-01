<script setup lang="ts">
import { useHideBottomNavigationLabel } from '~/composables/settings'

defineProps<{
  activeClass: string
}>()

const hideLabel = useHideBottomNavigationLabel()
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
    <span v-if="!hideLabel" text-xs>{{ $t('nav.lists') }}</span>
  </NuxtLink>
</template>
