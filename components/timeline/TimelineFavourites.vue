<script setup lang="ts">
const paginator = useMasto().favourites.iterate()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
