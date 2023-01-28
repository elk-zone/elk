<script setup lang="ts">
const paginator = useMastoClient().v1.bookmarks.list()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
