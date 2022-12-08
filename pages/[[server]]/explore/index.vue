<script lang="ts" setup>
const paginator = useMasto().trends.iterateStatuses()
</script>

<template>
  <!-- TODO: Tabs for trending statuses, tags, and links -->
  <TimelinePaginator :paginator="paginator" context="public" />
</template>
