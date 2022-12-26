<script setup lang="ts">
const paginator = useMasto().conversations.iterate()
</script>

<template>
  <ConversationPaginator :paginator="paginator" />
</template>
