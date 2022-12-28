<script setup lang="ts">
import type { AriaLive } from '~/composables/aria'

// tsc complaining when using $defineProps
withDefaults(defineProps<{
  ariaLive?: AriaLive
}>(), {
  ariaLive: 'polite',
})

const { announceStatus, clearStatus, status } = useAriaStatus()

defineExpose({
  announceStatus,
  clearStatus,
})
</script>

<template>
  <slot />
  <p sr-only role="status" :aria-live="ariaLive">
    <slot name="status" :status="status">
      {{ status }}
    </slot>
  </p>
</template>
