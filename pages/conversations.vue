<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().conversations.iterate()

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav_side.conversations'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/conversations" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:at-line />
        <span>{{ t('nav_side.conversations') }}</span>
      </NuxtLink>
    </template>

    <slot>
      <ConversationPaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
