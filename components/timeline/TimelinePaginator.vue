<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator" virtual-scroller>
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
