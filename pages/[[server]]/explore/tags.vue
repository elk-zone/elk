<script lang="ts" setup>
import { STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS } from '~~/constants'

const { t } = useI18n()

const masto = useMasto()
const { data, pending, error } = useLazyAsyncData(
  async () => masto.v1.trends.listTags({ limit: 20 }),
  { immediate: true },
)

const hideTagsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS, false)

useHeadFixed({
  title: () => `${t('tab.hashtags')} | ${t('nav.explore')}`,
})
</script>

<template>
  <CommonAlert v-if="isHydrated && !hideTagsTips && data && data.length" @close="hideTagsTips = true">
    <p>{{ $t('tooltip.explore_tags_intro') }}</p>
  </CommonAlert>

  <div v-if="data && data.length">
    <TagCard v-for="item of data" :key="item.name" :tag="item" border="b base" />

    <div p5 text-center text-secondary-light italic>
      {{ $t('common.end_of_list') }}
    </div>
  </div>
  <div v-else-if="pending">
    <TagCardSkeleton border="b base" />
    <TagCardSkeleton border="b base" />
    <TagCardSkeleton border="b base" op50 />
    <TagCardSkeleton border="b base" op50 />
    <TagCardSkeleton border="b base" op25 />
  </div>
  <div v-else-if="error" p5 text-center text-red italic>
    {{ $t('common.error') }}: {{ error }}
  </div>
  <div v-else p5 text-center text-secondary italic>
    {{ $t('error.explore-list-empty') }}
  </div>
</template>
