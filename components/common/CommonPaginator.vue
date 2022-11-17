<script setup lang="ts">
import type { Paginator } from 'masto'

const { paginator, keyProp = 'id' } = defineProps<{
  paginator: Paginator<any, any[]>
  keyProp?: string
}>()

const { items, state, endAnchor, error } = usePaginator(paginator)
</script>

<template>
  <div>
    <slot
      v-for="item of items"
      :key="item[keyProp]"
      :item="item"
    />
    <div ref="endAnchor" />
    <div v-if="state === 'loading'" p5 color-gray-5>
      Loading...
    </div>
    <div v-else-if="state === 'done'" p5 color-gray>
      End of list
    </div>
    <div v-else-if="state === 'error'" p5 color-gray>
      ERROR: {{ error }}
    </div>
  </div>
</template>
