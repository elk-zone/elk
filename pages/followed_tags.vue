<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const { client } = $(useMasto())
const paginator = client.v1.followedTags.list()

useHydratedHead({
  title: () => t('nav.followed_tags'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span timeline-title-style>{{ $t('nav.followed_tags') }}</span>
    </template>

    <TagCardPaginator :paginator="paginator" />
  </MainContent>
</template>
