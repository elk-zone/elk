<script setup lang="ts">
const paginator = useMastoClient().v1.lists.list()
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      {{ item.id }} {{ item.title }}
    </template>
  </CommonPaginator>
</template>
