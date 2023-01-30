<script setup lang="ts" generic="T, O, U = T">
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
  noEndMessage = false,
} = defineProps<{
  paginator: Paginator<T[], O>
  keyProp?: keyof T
  virtualScroller?: boolean
  stream?: Promise<WsEvents>
  eventType?: 'notification' | 'update'
  preprocess?: (items: (U | T)[]) => U[]
  noEndMessage?: boolean
}>()

defineSlots<{
  default: {
    items: U[]
    item: U
    index: number
    active?: boolean
    older?: U
    newer?: U // newer is undefined when index === 0
  }
  items: {
    items: U[]
  }
  updater: {
    number: number
    update: () => void
  }
  loading: {}
  done: {}
}>()

const { t } = useI18n()
const nuxtApp = useNuxtApp()

const { items, prevItems, update, state, endAnchor, error } = usePaginator(paginator, $$(stream), eventType, preprocess)

nuxtApp.hook('elk-logo:click', () => {
  update()
  nuxtApp.$scrollToTop()
})
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
            :index="index"
            :items="items"
          />
        </DynamicScroller>
      </template>
      <template v-else>
        <slot
          v-for="item, index of items"
          :key="(item as any)[keyProp]"
          :item="item"
          :older="items[index + 1]"
          :newer="items[index - 1]"
          :index="index"
          :items="items"
        />
      </template>
    </slot>
    <div ref="endAnchor" />
    <slot v-if="state === 'loading'" name="loading">
      <TimelineSkeleton />
    </slot>
    <slot v-else-if="state === 'done' && !noEndMessage" name="done">
      <div p5 text-secondary italic text-center>
        {{ t('common.end_of_list') }}
      </div>
    </slot>
    <div v-else-if="state === 'error'" p5 text-secondary>
      {{ t('common.error') }}: {{ error }}
    </div>
  </div>
</template>
