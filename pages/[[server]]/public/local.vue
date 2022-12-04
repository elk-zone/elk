<script setup lang="ts">
const paginator = useMasto().timelines.iteratePublic({ local: true })
const stream = await useMasto().stream.streamCommunityTimeline()
onBeforeUnmount(() => stream.disconnect())

const { t } = useI18n()

useHeadFixed({
  title: () => t('title.local_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public/local" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:group-2-line />
        <span>{{ t('title.local_timeline') }}</span>
      </NuxtLink>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
    </slot>
  </MainContent>
</template>
