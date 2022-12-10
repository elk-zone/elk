<script lang="ts" setup>
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import { STORAGE_KEY_HIDE_NEWS_TIPS } from '~~/constants'
const paginator = useMasto().trends.links

const virtualScroller = $(computedEager(() => useFeatureFlags().experimentalVirtualScroll))

const hideNewsTips = useLocalStorage(STORAGE_KEY_HIDE_NEWS_TIPS, false)
</script>

<template>
  <div
    v-if="!hideNewsTips"
    flex="~ gap-2" justify-between items-center
    px4 py2 sm:py4 border="b base"
    text-sm text-secondary
  >
    <p>
      {{ $t('help.links_tips') }}
    </p>
    <button text-xl hover:text-primary bg-hover-overflow w-1.4em h-1.4em @click="hideNewsTips = true">
      <div i-ri:close-line />
    </button>
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
