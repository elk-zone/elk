<script setup lang="ts">
const noUserVisual = computed(() => isHydrated.value && currentUser.value)
</script>

<template>
  <NuxtLink
    v-if="noUserVisual"
    to="/compose"
    :aria-label="$t('action.compose')"
    fixed
    p3
    mb4
    rounded-full
    bg-primary
    border-primary
    flex
    gap-2
    justify-center
    items-center
    z-50
    class="w-[60px] h-[60px] top-[82vh] left-[83vw] md:top-[90vh] md:left-[90vw]"
    text-xl
    xl:hidden
  >
    <div i-ri:quill-pen-line />
  </NuxtLink>
</template>
