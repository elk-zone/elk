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
  postprocess = items => items,
  noEndMessage = false,
} = defineProps<{
  paginator: Paginator<T[], O>
  keyProp?: keyof T
  virtualScroller?: boolean
  stream?: Promise<WsEvents>
  eventType?: 'notification' | 'update'
  preprocess?: (items: (U | T)[]) => U[]
  postprocess?: (items: U[]) => U[]
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

const postProcessedItems = computedWithControl(
  () => items.value,
  () => postprocess(items.value as U[]),
)

nuxtApp.hook('elk-logo:click', () => {
  update()
  nuxtApp.$scrollToTop()
})

nuxtApp.hook('elk-timeline-home-filter:change', () => {
  postProcessedItems.trigger()
  nuxtApp.$scrollToTop()
})

function createEntry(item: any) {
  items.value = [...items.value, preprocess?.([item]) ?? item]
}

function updateEntry(item: any) {
  const id = item[keyProp]
  const index = items.value.findIndex(i => (i as any)[keyProp] === id)
  if (index > -1)
    items.value = [...items.value.slice(0, index), preprocess?.([item]) ?? item, ...items.value.slice(index + 1)]
}

function removeEntry(entryId: any) {
  items.value = items.value.filter(i => (i as any)[keyProp] !== entryId)
}

defineExpose({ createEntry, removeEntry, updateEntry })
</script>

<template>
  <div>
    <slot v-if="prevItems.length" name="updater" v-bind="{ number: prevItems.length, update }" />
    <slot name="items" :items="postProcessedItems">
      <template v-if="virtualScroller">
        <DynamicScroller
          v-slot="{ item, active, index }"
          :items="postProcessedItems"
          :min-item-size="200"
          :key-field="keyProp"
          page-mode
        >
          <slot
            :key="item[keyProp]"
            :item="item"
            :active="active"
            :older="postProcessedItems[index + 1]"
            :newer="postProcessedItems[index - 1]"
            :index="index"
            :items="postProcessedItems"
          />
        </DynamicScroller>
      </template>
      <template v-else>
        <slot
          v-for="item, index of postProcessedItems"
          :key="(item as any)[keyProp]"
          :item="item"
          :older="postProcessedItems[index + 1]"
          :newer="postProcessedItems[index - 1]"
          :index="index"
          :items="postProcessedItems"
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
