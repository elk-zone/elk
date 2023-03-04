<script setup lang="ts">
const paginator = useMastoClient().v1.accounts.listStatuses(currentUser.value!.account.id, { pinned: true })
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
