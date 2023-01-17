<script setup lang="ts">
const paginator = useMastoClient().v1.followedTags.list()
</script>

<template>
  <TagCardPaginator :paginator="paginator" />
</template>
