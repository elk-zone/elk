<script setup lang="ts">
import type { AriaLive } from '~/composables/aria/types'
import { useAriaStatus } from '~/composables/aria'

const { ariaLive } = $defineProps<{
  ariaLive?: AriaLive
}>()

// to fix TSC error
const _ariaLive = $computed(() => ariaLive ?? 'polite')

const { announceStatus, clearStatus, status } = useAriaStatus()

defineExpose({
  announceStatus,
  clearStatus,
})
</script>

<template>
  <slot />
  <p sr-only role="status" :aria-live="_ariaLive">
    <slot name="status" :status="status">
      {{ status }}
    </slot>
  </p>
</template>
