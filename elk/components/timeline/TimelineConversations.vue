<script setup lang="ts">
const paginator = useAkkoClient().v1.conversations.list()
</script>

<template>
  <ConversationPaginator :paginator="paginator" />
</template>
