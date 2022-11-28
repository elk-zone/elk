<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().bookmarks.getIterator()

const { t } = useI18n()

useHead({
  title: () => t('nav_side.bookmarks'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ t('nav_side.bookmarks') }}</span>
    </template>

    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
