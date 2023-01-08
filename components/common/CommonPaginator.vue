<script setup lang="ts" generic="T, O">
// @ts-expect-error missing types
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Paginator, WsEvents } from 'masto'

const {
  paginator,
  stream,
  keyProp = 'id',
  eventType = 'update',
  buffer = 10,
  preprocess,
} = defineProps<{
  paginator: Paginator<T[], O>
  keyProp?: keyof T
  stream?: Promise<WsEvents>
  eventType?: 'notification' | 'update'
  // When preprocess is used, buffer is the number of items that will be hidden
  // until the next pagination to avoid border effect between pages when reordering
  // and grouping items
  buffer?: number
  preprocess?: (items: T[]) => any[]
}>()

defineSlots<{
  default: {
    items: T[]
    item: T
    index: number
    active?: boolean
    older?: T
    newer?: T // newer is undefined when index === 0
  }
  items: {
    items: T[]
  }
  updater: {
    number: number
    update: () => void
  }
  loading: {}
  done: {}
}>()

const { t } = useI18n()

const { items, prevItems, update, state, endAnchor, error } = usePaginator(paginator, stream, eventType, preprocess)
</script>

<template>
  <div>
    <slot v-if="prevItems.length" name="updater" v-bind="{ number: prevItems.length, update }" />
    <slot name="items" :items="items">
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
          :index="index"
          :items="items"
        />
      </DynamicScroller>
    </slot>
    <div ref="endAnchor" />
    <slot v-if="state === 'loading'" name="loading">
      <TimelineSkeleton />
    </slot>
    <slot v-else-if="state === 'done'" name="done">
      <div p5 text-secondary italic text-center>
        {{ t('common.end_of_list') }}
      </div>
    </slot>
    <div v-else-if="state === 'error'" p5 text-secondary>
      {{ t('common.error') }}: {{ error }}
    </div>
  </div>
</template>
