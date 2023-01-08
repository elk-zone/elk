<script setup lang="ts">
const paginator = useMasto().v1.mutes.list()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
