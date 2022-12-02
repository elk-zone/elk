<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import type { FilterContext, Paginator, Status, WsEvents } from 'masto'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Status[]>
  stream?: WsEvents
  context?: FilterContext
}>()

const virtualScroller = $(computedEager(() => useFeatureFlags().experimentalVirtualScroll))
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        {{ $t('timeline.show_new_items', [number]) }}
      </button>
    </template>
    <template #default="{ item, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :status="item" border="b base" :context="context" py-3 />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard :status="item" border="b base" :context="context" py-3 />
      </template>
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" py-3 />
      <StatusCardSkeleton border="b base" py-3 op50 />
      <StatusCardSkeleton border="b base" py-3 op25 />
    </template>
  </CommonPaginator>
</template>
