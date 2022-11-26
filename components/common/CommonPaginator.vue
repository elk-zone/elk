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
    <div v-if="state === 'loading'" p5 text-center flex="~ col" items-center animate-pulse>
      <div text-secondary i-ri:loader-2-fill animate-spin text-2xl />
      <span text-secondary>Loading...</span>
    </div>
    <div v-else-if="state === 'done'" p5 text-secondary italic text-center>
      End of the list
    </div>
    <div v-else-if="state === 'error'" p5 text-secondary>
      ERROR: {{ error }}
    </div>
  </div>
</template>
