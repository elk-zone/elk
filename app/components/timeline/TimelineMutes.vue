<script setup lang="ts">
const paginator = useMastoClient().v1.mutes.list()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
