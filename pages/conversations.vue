<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().conversations.getIterator()

const { t } = useI18n()

useHead({
  title: () => t('nav_side.conversations'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ t('nav_side.conversations') }}</span>
    </template>

    <slot>
      <ConversationPaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
