<script setup lang="ts">
import type { AriaLive } from '~/composables/aria/types'
import { useAriaStatus } from '~/composables/aria'

const { ariaLive = 'polite' } = $defineProps<{
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
    {{ status }}
  </p>
</template>
