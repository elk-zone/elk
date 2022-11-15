<script setup lang="ts">
const masto = await useMasto()
const paginator = masto.timelines.getPublicIterable()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
