<script setup lang="ts">
const paginator = useMasto().v1.favourites.list()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
