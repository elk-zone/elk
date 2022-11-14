<script setup lang="ts">
const server = useCookie('nuxtodon-server')
const token = useCookie('nuxtodon-token')
</script>

<template>
  <div p4>
    <input
      v-model="server"
      placeholder="Server URL"
      bg-transparent text-current
      border="~ border" p="x2 y1" w-full
      outline-none
    >
    <input
      v-model="token"
      placeholder="Token"
      bg-transparent text-current
      border="~ border" p="x2 y1" w-full
      outline-none
    >
  </div>
</template>
