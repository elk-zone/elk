<script setup lang="ts">
import type { Placement } from 'floating-vue'

export interface Props {
  content?: string
  placement?: Placement
  disabled?: boolean
  distance?: string | number
  delay?: string | number | { show: number, hide: number }
  id?: string
}

const { content, disabled = undefined, ...tooltipProps } = defineProps<Props>()
</script>

<template>
  <VTooltip
    v-if="isHydrated"
    v-bind="tooltipProps"
    :disabled="disabled"
    auto-hide
    no-auto-focus
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
