<script setup lang="ts">
const params = useRoute().params
const tag = $computed(() => params.tag as string)
const masto = await useMasto()
const paginator = masto.timelines.getHashtagIterable(tag)
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:hashtag h-6 mr-1 /><span>{{ tag }}</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
