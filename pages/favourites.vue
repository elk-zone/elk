<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().favourites.getIterator()
const { t } = useI18n()

useHeadFixed({
  title: () => t('nav_side.favourites'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/favourites" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:heart-3-line />
        <span>{{ t('nav_side.favourites') }}</span>
      </NuxtLink>
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
