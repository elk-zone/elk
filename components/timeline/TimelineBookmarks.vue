<script setup lang="ts">
const paginator = useMasto().v1.bookmarks.list()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
