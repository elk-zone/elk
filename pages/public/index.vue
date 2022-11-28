<script setup lang="ts">
const paginator = useMasto().timelines.getPublicIterable()
const stream = await useMasto().stream.streamPublicTimeline()
onBeforeUnmount(() => stream.disconnect())

const { t } = useI18n()

useHead({
  title: () => t('nav_side.federated'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ t('title.federated-timeline') }}</span>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
