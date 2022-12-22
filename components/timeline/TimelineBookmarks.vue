<script setup lang="ts">
const paginator = useMasto().bookmarks.iterate()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
