<script setup lang="ts">
const route = useRoute()

const serverId = route.params.server
if (typeof serverId === 'string') {
  navigateTo(`${serverId}/public/local`)
}
</script>

<template>
  <div>Redirecting to login...</div>
</template>
