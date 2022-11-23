<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const server = ref()

async function oauth() {
  const a = document.createElement('a')
  a.href = `/api/${server.value}/login`
  a.target = '_blank'
  a.click()
}
</script>

<template>
  <div h-full text-center justify-center flex="~ col items-center gap2">
    <div text-4xl mb-10>
      Nuxtodon
    </div>

    <div>Mastodon Server</div>
    <div bg-gray:10 px2 py1 rounded border="~ border" w-50 mxa flex>
      <span op25 mr1>https://</span>
      <input v-model="server" outline-none bg-transparent>
    </div>
    <button bg-teal6 px2 py1 rounded w-20 mxa mt-5 @click="oauth()">
      Login
    </button>
  </div>
</template>
