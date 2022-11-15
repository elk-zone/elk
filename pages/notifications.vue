<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()
const paginator = masto.notifications.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:notification-2-fill h-6 mr-1 /><span>Notifications</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <NotificationPaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
