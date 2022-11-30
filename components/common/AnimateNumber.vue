<script setup lang="ts">
defineProps<{
  increased: boolean
}>()
</script>

<template>
  <div overflow-hidden h="1.25rem">
    <div
      transition="duration-300 transform"
      :style="{
        transform: increased ? 'translateY(-50%)' : 'translateY(0%)',
      }"
    >
      <slot />
      <slot name="next" />
    </div>
  </div>
</template>
