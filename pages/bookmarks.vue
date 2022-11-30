<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().bookmarks.getIterator()

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav_side.bookmarks'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/bookmarks" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:bookmark-line />
        <span>{{ t('nav_side.bookmarks') }}</span>
      </NuxtLink>
    </template>

    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
