<script setup lang="ts">
const masto = await useMasto()
const { data: timelines } = await useAsyncData('public-timelines', () => masto.timelines.fetchPublic().then(r => r.value))
</script>

<template>
  <div w-150>
    <template v-for="status of timelines" :key="status.id">
      <StatusCard :status="status" border="t gray/10" pt-4 />
    </template>
  </div>
</template>
