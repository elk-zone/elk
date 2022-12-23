<script setup lang="ts">
const paginator = useMasto().blocks.iterate()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
