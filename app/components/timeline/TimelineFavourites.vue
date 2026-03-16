<script setup lang="ts">
const paginator = useMastoClient().v1.favourites.list()
</script>

<template>
  <TimelinePaginator end-message="common.no_favourites" :paginator="paginator" />
</template>
