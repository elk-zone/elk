<script setup lang="ts">
const paginator = useMastoClient().v1.scheduledStatuses.list()
</script>

<template>
  <TimelineScheduledPostsPaginator end-message="common.no_scheduled_posts" :paginator="paginator" />
</template>
