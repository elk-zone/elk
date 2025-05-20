<script setup lang="ts">
import type { AriaLive } from '~/composables/aria'

const { ariaLive = 'polite' } = defineProps<{
  ariaLive?: AriaLive
}>()

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
