<script setup lang="ts">
const paginator = useAkkoClient().v1.bookmarks.list()
</script>

<template>
  <TimelinePaginator end-message="common.no_bookmarks" :paginator="paginator" />
</template>
