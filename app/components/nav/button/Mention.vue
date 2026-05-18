<script setup lang="ts">
defineProps<{
  activeClass: string
}>()

const hideLabel = useHideBottomNavigationLabel()
</script>

<template>
  <NuxtLink
    to="/conversations"
    :aria-label="$t('nav.conversations')"
    :active-class="activeClass"
    flex flex-col items-center place-content-center h-full flex-1 min-w-0
    class="coarse-pointer:select-none"
    :class="hideLabel ? null : 'gap-1'"
    @click="$scrollToTop"
  >
    <div aria-hidden="true" i-ri:at-line />
    <span v-if="!hideLabel" text-xs overflow-hidden text-ellipsis whitespace-nowrap>
      {{ $t('nav.conversations') }}
    </span>
  </NuxtLink>
</template>
