<script lang="ts" setup>
import { STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS } from '~~/constants'

const { t } = useI18n()

const paginator = useMastoClient().v1.trends.statuses.list()

const hideNewsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS, false)

useHydratedHead({
  title: () => `${t('tab.posts')} | ${t('nav.explore')}`,
})
</script>

<template>
  <CommonAlert v-if="isHydrated && !hideNewsTips" @close="hideNewsTips = true">
    <p>{{ $t('tooltip.explore_posts_intro') }}</p>
  </CommonAlert>
  <!-- TODO: Tabs for trending statuses, tags, and links -->
  <TimelinePaginator :paginator="paginator" context="public" />
</template>
