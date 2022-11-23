<script setup lang="ts">
const params = useRoute().params
const tag = $computed(() => params.tag as string)

const paginator = masto.timelines.getHashtagIterable(tag)
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>#{{ tag }}</span>
    </template>
    <template #actions>
      <div i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
