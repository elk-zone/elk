<script setup lang="ts">
import { useHideBottomNavigationLabel } from '~/composables/settings'

defineProps<{
  activeClass: string
}>()

const hideLabel = useHideBottomNavigationLabel()
</script>

<template>
  <NuxtLink
    to="/bookmarks"
    :aria-label="$t('nav.bookmarks')"
    :active-class="activeClass"
    flex flex-col items-center place-content-center h-full flex-1
    class="coarse-pointer:select-none"
    :class="hideLabel ? null : 'gap-1'"
    @click="$scrollToTop"
  >
    <div aria-hidden="true" i-ri:bookmark-line />
    <span v-if="!hideLabel" text-xs>{{ $t('nav.bookmarks') }}</span>
  </NuxtLink>
</template>
