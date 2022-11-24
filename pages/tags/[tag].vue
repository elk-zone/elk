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

    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
