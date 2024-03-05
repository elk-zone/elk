<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const { client } = useMasto()
const paginator = client.value.v1.followedTags.list({
  limit: 20,
})

useHydratedHead({
  title: () => t('nav.hashtags'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/hashtags" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div class="i-ri:hashtag" />
        <span>{{ t('nav.hashtags') }}</span>
      </NuxtLink>
    </template>

    <TagCardPaginator v-bind="{ paginator }" />
  </MainContent>
</template>
