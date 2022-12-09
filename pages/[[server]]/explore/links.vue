<script lang="ts" setup>
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
const paginator = useMasto().trends.links

const virtualScroller = $(computedEager(() => useFeatureFlags().experimentalVirtualScroll))
</script>

<template>
  <div space-y-3 text-center p4 border="b base">
    这些新闻故事正被本站和分布式网络上其他站点的用户谈论。
  </div>

  <CommonPaginator v-bind="{ paginator }" :virtual-scroller="virtualScroller">
    <template #default="{ item, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusPreviewCard :card="item" border="!b base" rounded="!none" p="!4" small-picture-only root />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusPreviewCard :card="item" border="!b base" rounded="!none" p="!4" small-picture-only root />
      </template>
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" />
      <StatusCardSkeleton border="b base" op50 />
      <StatusCardSkeleton border="b base" op25 />
    </template>
  </CommonPaginator>
</template>
