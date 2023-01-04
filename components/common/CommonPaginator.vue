<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Account, Paginator, WsEvents } from 'masto'

const {
  paginator,
  stream,
  keyProp = 'id',
  virtualScroller = false,
  eventType = 'update',
  preprocess,
  isAccountTimeline,
} = defineProps<{
  paginator: Paginator<any, any[]>
  keyProp?: string
  virtualScroller?: boolean
  stream?: Promise<WsEvents>
  eventType?: 'notification' | 'update'
  preprocess?: (items: any[]) => any[]
  isAccountTimeline?: boolean
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
}>()

let account: Account | null = null

const { params } = useRoute()

if (isAccountTimeline) {
  const handle = $(computedEager(() => params.account as string))

  account = await fetchAccountByHandle(handle)
}

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
    <div v-else-if="state === 'done'" p5 text-secondary italic text-center flex flex-col items-center gap1>
      <template v-if="isAccountTimeline">
        <span>{{ $t('timeline.view_older_posts') }}</span>
        <a :href="account!.url" not-italic text-primary hover="underline text-primary-active">{{ $t('menu.open_in_original_site') }}</a>
      </template>
      <template v-else>
        {{ $t('common.end_of_list') }}
      </template>
    </div>
    <div v-else-if="state === 'error'" p5 text-secondary>
      {{ $t('common.error') }}: {{ error }}
    </div>
  </div>
</template>
