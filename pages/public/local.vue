<script setup lang="ts">
const paginator = useMasto().timelines.getPublicIterable({ local: true })
const stream = await useMasto().stream.streamCommunityTimeline()
onBeforeUnmount(() => stream.disconnect())

const { t } = useI18n()

useHead({
  title: () => t('nav_side.local'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ t('title.local_timeline') }}</span>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
