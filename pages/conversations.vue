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
    <template #actions>
      <div i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <ConversationPaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
