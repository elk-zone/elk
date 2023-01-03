<script setup lang="ts">
const paginator = useMasto().accounts.iterateStatuses(currentUser.value.account!.id, { pinned: true })
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
