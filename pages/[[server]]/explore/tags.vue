<script lang="ts" setup>
import { STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS } from '~~/constants'

const { t } = useI18n()

const { client } = useMasto()
const paginator = client.value.v1.trends.tags.list({
  limit: 20,
})

const hideTagsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS, false)

useHydratedHead({
  title: () => `${t('tab.hashtags')} | ${t('nav.explore')}`,
})
</script>

<template>
  <CommonAlert v-if="!hideTagsTips" @close="hideTagsTips = true">
    <p>{{ $t('tooltip.explore_tags_intro') }}</p>
  </CommonAlert>

  <TagCardPaginator v-bind="{ paginator }" />
</template>
