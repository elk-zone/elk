<script setup lang="ts">
const paginator = useMastoClient().v1.blocks.list()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
