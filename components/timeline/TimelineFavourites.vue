<script setup lang="ts">
const paginator = useMastoClient().v1.favourites.list()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
