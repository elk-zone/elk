<script setup lang="ts">
const paginator = useMasto().v1.conversations.list()
</script>

<template>
  <ConversationPaginator :paginator="paginator" />
</template>
