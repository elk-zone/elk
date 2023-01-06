<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Paginator, WsEvents } from 'masto'

const {
  paginator,
  stream,
  keyProp = 'id',
  virtualScroller = false,
  eventType = 'update',
  preprocess,
} = defineProps<{
  paginator: Paginator<any, any[]>
  keyProp?: string
  virtualScroller?: boolean
  stream?: Promise<WsEvents>
  eventType?: 'notification' | 'update'
  preprocess?: (items: any[]) => any[]
}>()

defineSlots<{
  default: {
    item: any
    active?: boolean
    older?: any
    newer?: any // newer is undefined when index === 0
  }
  updater: {
    number: number
    update: () => void
  }
  loading: {}
  done: {}
}>()

const { items, prevItems, update, state, endAnchor, error } = usePaginator(paginator, stream, eventType, preprocess)
</script>

<template>
  <div>
    <slot v-if="prevItems.length" name="updater" v-bind="{ number: prevItems.length, update }" />
    <slot name="items" :items="items">
      <template v-if="virtualScroller">
        <DynamicScroller
          v-slot="{ item, active, index }"
          :items="items"
          :min-item-size="200"
          :key-field="keyProp"
          page-mode
        >
          <slot
            :key="item[keyProp]"
            :item="item"
            :active="active"
            :older="items[index + 1]"
            :newer="items[index - 1]"
          />
        </DynamicScroller>
      </template>
      <template v-else>
        <slot
          v-for="item, index of items"
          :key="item[keyProp]"
          :item="item"
          :older="items[index + 1]"
          :newer="items[index - 1]"
        />
      </template>
    </slot>
    <div ref="endAnchor" />
    <slot v-if="state === 'loading'" name="loading">
      <TimelineSkeleton />
    </slot>
    <slot v-else-if="state === 'done'" name="done">
      <div p5 text-secondary italic text-center>
        {{ $t('common.end_of_list') }}
      </div>
    </slot>
    <div v-else-if="state === 'error'" p5 text-secondary>
      {{ $t('common.error') }}: {{ error }}
    </div>
  </div>
</template>
