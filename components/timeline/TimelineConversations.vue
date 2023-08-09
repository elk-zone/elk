<script setup lang="ts">
const paginator = useMastoClient().v1.conversations.list()
</script>

<template>
  <ConversationPaginator :paginator="paginator" />
</template>
