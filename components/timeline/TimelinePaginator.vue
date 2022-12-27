<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { FilterContext, Paginator, Status, WsEvents } from 'masto'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Status[]>
  stream?: WsEvents
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
    <template #default="{ item, older, newer, active, index }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard
            :status="item" :context="context"
            :connect-reply="item.id === older?.inReplyToId"
            :show-reply-to="!(item.inReplyToId && item.inReplyToId === newer?.id)"
            :class="{ 'border-t border-base': index !== 0 && !(item.inReplyToId && item.inReplyToId === newer?.id) }"
          />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard
          :status="item" :context="context"
          :connect-reply="item.id === older?.inReplyToId"
          :show-reply-to="!(item.inReplyToId && item.inReplyToId === newer?.id)"
          :class="{ 'border-t border-base': !(item.inReplyToId && item.inReplyToId === newer?.id) }"
        />
      </template>
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" />
      <StatusCardSkeleton border="b base" op50 />
      <StatusCardSkeleton border="b base" op25 />
    </template>
  </CommonPaginator>
</template>
