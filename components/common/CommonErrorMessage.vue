<script setup lang="ts">
defineProps<{ describedBy: string }>()
</script>

<template>
  <div
    role="alert"
    aria-live="polite"
    :aria-describedby="describedBy"
    flex="~ col"
    gap-1 text-sm
    pt-1 ps-2 pe-1 pb-2
    text-red-600 dark:text-red-400
    border="~ base rounded red-600 dark:red-400"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
