<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.conversations.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Conversations</span>
    </template>

    <slot>
      <ConversationPaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
