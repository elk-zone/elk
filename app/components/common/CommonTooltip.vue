<script setup lang="ts">
import type { Popper as VTooltipType } from 'floating-vue'

export interface Props extends Partial<typeof VTooltipType> {
  content?: string
}

defineProps<Props>()
</script>

<template>
  <VTooltip
    v-if="isHydrated"
    v-bind="$attrs"
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
