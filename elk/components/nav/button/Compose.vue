<script setup lang="ts">
const props = defineProps<{
  [x: string]: unknown
}>()

const noUserVisual = computed(() => isHydrated.value && currentUser.value)
</script>

<template>
  <NuxtLink
    v-if="noUserVisual"
    v-bind="props"
    to="/compose"
    :aria-label="$t('action.compose')"
    p3
    mb4
    mr4
    rounded-full
    bg-primary
    border-primary
    flex
    gap-2
    justify-center
    items-center
    relative
    ml-auto
    class="w-[60px] h-[60px]"
    text-xl
  >
    <div i-ri:quill-pen-line />
  </NuxtLink>
</template>
