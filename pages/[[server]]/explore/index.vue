<script lang="ts" setup>
import { STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS } from '~~/constants'

const paginator = useMasto().trends.iterateStatuses()

const hideNewsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS, false)
</script>

<template>
  <CommonAlert v-if="!hideNewsTips" @close="hideNewsTips = true">
    <p>{{ $t('tooltip.explore_posts_intro') }}</p>
  </CommonAlert>
  <!-- TODO: Tabs for trending statuses, tags, and links -->
  <TimelinePaginator :paginator="paginator" context="public" />
</template>
