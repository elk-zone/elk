<script setup lang="ts">
import type { Popper as VTooltipType } from 'floating-vue/dist'

defineProps<{
  content?: string
} & Partial<typeof VTooltipType>>()
</script>

<template>
  <VTooltip
    v-bind="$attrs"
    auto-hide
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
