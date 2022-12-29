<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { FilterContext, Paginator, Status, WsEvents } from 'masto'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Status[]>
  stream?: Promise<WsEvents>
  context?: FilterContext
  preprocess?: (items: any[]) => any[]
}>()

const virtualScroller = $(computedEager(() => useFeatureFlags().experimentalVirtualScroll))
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream, preprocess }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        {{ $t('timeline.show_new_items', number) }}
      </button>
    </template>
    <template #default="{ item, older, newer, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :status="item" :context="context" :older="older" :newer="newer" />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard :status="item" :context="context" :older="older" :newer="newer" />
      </template>
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" />
      <StatusCardSkeleton border="b base" op50 />
      <StatusCardSkeleton border="b base" op25 />
    </template>
  </CommonPaginator>
</template>
