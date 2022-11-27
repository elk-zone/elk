<script setup lang="ts">
const params = useRoute().params
const tag = $(computedEager(() => params.tag as string))

const paginator = useMasto().timelines.getHashtagIterable(tag)

useHead({
  title: `#${tag}`,
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>#{{ tag }}</span>
    </template>

    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
