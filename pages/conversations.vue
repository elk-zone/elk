<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()
const paginator = masto.conversations.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:at-line h-6 mr-1 /><span>Conversations</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <ConversationPaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
