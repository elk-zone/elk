<script setup lang="ts">
import type { PaginatorState } from '~/types'

defineProps<{
  state: PaginatorState
}>()
</script>

<template>
  <slot />
  <div v-if="state === 'loading'" p5 color-gray-5>
    Loading...
  </div>
  <div v-if="state === 'done'" p5 color-gray>
    End of list
  </div>
</template>
