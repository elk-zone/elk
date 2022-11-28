<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import type { Paginator, Status, WsEvents } from 'masto'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Status[]>
  stream?: WsEvents
}>()
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream }" virtual-scroller>
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        Show {{ number }} new items
      </button>
    </template>
    <template #default="{ item, active }">
      <DynamicScrollerItem :item="item" :active="active" tag="article">
        <StatusCard
          :status="item"
          border="b base" py-3
        />
      </DynamicScrollerItem>
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" py-3 />
      <StatusCardSkeleton border="b base" py-3 op50 />
      <StatusCardSkeleton border="b base" py-3 op25 />
    </template>
  </CommonPaginator>
</template>
