<script setup lang="ts">
const { server, token } = useAppCookies()

async function oauth() {
  const a = document.createElement('a')
  a.href = `/api/${server.value}/login`
  a.target = '_blank'
  a.click()
}
</script>

<template>
  <div p4>
    <button @click="oauth()">
      OAuth
    </button>
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
