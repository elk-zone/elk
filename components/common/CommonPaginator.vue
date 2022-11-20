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
      <div op50 i-ri:loader-2-fill animate-spin text-2xl />
      <span op50>Loading...</span>
    </div>
    <div v-else-if="state === 'done'" p5 op50 italic text-center>
      End of the list
    </div>
    <div v-else-if="state === 'error'" p5 op50>
      ERROR: {{ error }}
    </div>
  </div>
</template>
