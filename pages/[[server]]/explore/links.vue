<script lang="ts" setup>
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import { STORAGE_KEY_HIDE_EXPLORE_NEWS_TIPS } from '~~/constants'
const paginator = useMasto().trends.links

const hideNewsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_NEWS_TIPS, false)
</script>

<template>
  <CommonAlert v-if="!hideNewsTips" @close="hideNewsTips = true">
    <p>{{ $t('tooltip.explore_links_intro') }}</p>
  </CommonAlert>

  <CommonPaginator v-bind="{ paginator }">
    <template #default="{ item }">
      <StatusPreviewCard :card="item" border="!b base" rounded="!none" p="!4" small-picture-only root />
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" />
      <StatusCardSkeleton border="b base" op50 />
      <StatusCardSkeleton border="b base" op25 />
    </template>
  </CommonPaginator>
</template>
