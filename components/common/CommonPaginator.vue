<script setup lang="ts">
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Paginator } from 'masto'

const { paginator, keyProp = 'id', virtualScroller = false } = defineProps<{
  paginator: Paginator<any, any[]>
  keyProp?: string
  virtualScroller: boolean
}>()

const { items, state, endAnchor, error } = usePaginator(paginator)
</script>

<template>
  <div>
    <template v-if="virtualScroller">
      <DynamicScroller v-slot="{ item, active }" :items="items" :min-item-size="200" page-mode>
        <slot :item="item" :active="active" />
      </DynamicScroller>
    </template>
    <template v-else>
      <slot
        v-for="item of items"
        :key="item[keyProp]"
        :item="item"
      />
    </template>
    <div ref="endAnchor" />
    <slot v-if="state === 'loading'" name="loading">
      <div p5 text-center flex="~ col" items-center animate-pulse>
        <div text-secondary i-ri:loader-2-fill animate-spin text-2xl />
        <span text-secondary>Loading...</span>
      </div>
    </slot>
    <div v-else-if="state === 'done'" p5 text-secondary italic text-center>
      End of the list
    </div>
    <div v-else-if="state === 'error'" p5 text-secondary>
      ERROR: {{ error }}
    </div>
  </div>
</template>
