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
