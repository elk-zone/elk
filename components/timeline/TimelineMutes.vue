<script setup lang="ts">
const paginator = useMasto().mutes.iterate()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
