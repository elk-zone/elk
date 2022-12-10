<script lang="ts" setup>
import type { Tag } from 'masto'
import { STORAGE_KEY_HIDE_TAGS_TIPS } from '~~/constants'
const { data, pending, error } = useLazyAsyncData(() => useMasto().trends.fetchTags(), { immediate: true })

const hideTagsTips = useLocalStorage(STORAGE_KEY_HIDE_TAGS_TIPS, false)

function getTagUrl(tag: Tag) {
  return new URL(tag.url).pathname
}
</script>

<template>
  <CommonAlert v-if="!hideTagsTips && data && data.length" @close="hideTagsTips = true">
    <p>{{ $t('tooltip.explore_tags_intro') }}</p>
  </CommonAlert>

  <div v-if="data && data.length">
    <TagCard v-for="item of data" :key="item.name" :tag="item" border="b base">
      {{ item.name }}
      {{ item.following }}
      {{ item.url }}
    </TagCard>
  </div>
  <div v-else-if="pending">
    <StatusCardSkeleton border="b base" />
    <StatusCardSkeleton border="b base" op50 />
    <StatusCardSkeleton border="b base" op25 />
  </div>
  <div v-else-if="error" p5 text-center text-red italic>
    {{ $t('common.error') }}: {{ error }}
  </div>
  <div v-else p5 text-center text-secondary italic>
    {{ $t('error.explore-list-empty') }}
  </div>
</template>
