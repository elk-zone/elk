<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Paginator, WsEvents } from 'masto'

const { paginator, stream, keyProp = 'id', virtualScroller = false } = defineProps<{
  paginator: Paginator<any, any[]>
  keyProp?: string
  virtualScroller?: boolean
  stream?: WsEvents
}>()

defineSlots<{
  default: {
    item: any
    active?: boolean
  }
  updater: {
    number: number
    update: () => void
  }
  loading: {}
}>()

const { items, prevItems, update, state, endAnchor, error } = usePaginator(paginator, stream)
</script>

<template>
  <div>
    <slot v-if="prevItems.length" name="updater" v-bind="{ number: prevItems.length, update }" />
    <slot name="items" :items="items">
      <template v-if="virtualScroller">
        <DynamicScroller
          v-slot="{ item, active }"
          :items="items"
          :min-item-size="200"
          :key-field="keyProp"
          page-mode
        >
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
    </slot>
    <div ref="endAnchor" />
    <slot v-if="state === 'loading'" name="loading">
      <div p5 text-center flex="~ col" items-center animate-pulse>
        <div text-secondary i-ri:loader-2-fill animate-spin text-2xl />
        <span text-secondary>{{ $t('state.loading') }}</span>
      </div>
    </slot>
    <div v-else-if="state === 'done'" p5 text-secondary italic text-center>
      {{ $t('common.end_of_list') }}
    </div>
    <div v-else-if="state === 'error'" p5 text-secondary>
      {{ $t('common.error') }}: {{ error }}
    </div>
  </div>
</template>
