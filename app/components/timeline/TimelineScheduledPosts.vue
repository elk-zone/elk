<script setup lang="ts">
const paginator = useMastoClient().v1.scheduledStatuses.list()
</script>

<template>
  <CommonPaginator end-message="common.no_scheduled_posts" :paginator="paginator" />
</template>
