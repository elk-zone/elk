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
  <TagCardPaginator v-bind="{ paginator }" />
</template>
