<script setup lang="ts">
import { STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS, STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE } from '~~/constants'

const { t } = useI18n()
const route = useRoute()

const paginator = useMastoClient().v1.trends.statuses.list()

const hideNewsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS, false)

useHydratedHead({
  title: () => `${t('tab.posts')} | ${t('nav.explore')}`,
})

const lastAccessedExploreRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE, '')
lastAccessedExploreRoute.value = route.path.replace(/(.*\/explore\/?)/, '')

onActivated(() => {
  lastAccessedExploreRoute.value = route.path.replace(/(.*\/explore\/?)/, '')
})
</script>

<template>
  <CommonAlert v-if="isHydrated && !hideNewsTips" @close="hideNewsTips = true">
    <p>{{ $t('tooltip.explore_posts_intro') }}</p>
  </CommonAlert>
  <!-- TODO: Tabs for trending statuses, tags, and links -->
  <TimelinePaginator v-if="isHydrated" :paginator="paginator" context="public" />
</template>
