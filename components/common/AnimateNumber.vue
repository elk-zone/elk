<script setup lang="ts">
defineProps<{
  increased?: boolean
}>()
</script>

<template>
  <div of-hidden h="1.25rem">
    <div flex="~ col" transition-transform duration-300 :class="increased ? 'translate-y--1/2' : 'translate-y-0'">
      <slot />
      <slot name="next" />
    </div>
  </div>
</template>
