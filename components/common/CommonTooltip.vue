<script setup lang="ts">
defineProps<{
  content?: string
}>()
</script>

<template>
  <VTooltip
    v-bind="$attrs"
  >
    <slot />
    <template #popper>
      <div text-3>
        <slot name="popper">
          {{ content }}
        </slot>
      </div>
    </template>
  </VTooltip>
</template>
