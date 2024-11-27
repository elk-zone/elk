<script setup lang="ts">
const paginator = useAkkoClient().v1.mutes.list()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
