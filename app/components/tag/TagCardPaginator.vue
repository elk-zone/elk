<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

defineProps<{
  paginator: akkoma.Paginator<mastodon.v1.Tag[], akkoma.DefaultPaginationParams>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator" key-prop="name">
    <template #default="{ item }">
      <TagCard :tag="item" border="b base" />
    </template>
    <template #loading>
      <TagCardSkeleton border="b base" />
      <TagCardSkeleton border="b base" />
      <TagCardSkeleton border="b base" op50 />
      <TagCardSkeleton border="b base" op50 />
      <TagCardSkeleton border="b base" op25 />
    </template>
  </CommonPaginator>
</template>
