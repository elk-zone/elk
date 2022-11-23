<script setup lang="ts">
import { DEFAULT_SERVER } from '~/constants'

const server = ref<string>()

async function oauth() {
  location.href = `/api/${server.value || DEFAULT_SERVER}/login`
}
</script>

<template>
  <div h-full text-center justify-center flex="~ col items-center gap2">
    <div text-3xl mb2>
      Sign in
    </div>
    <div>Mastodon Server Name</div>
    <div flex bg-gray:10 px2 py1 mxa rounded border="~ border" w-80 text-xl items-center>
      <span op35 mr1 text-sm>https://</span>
      <input v-model="server" :placeholder="DEFAULT_SERVER" outline-none bg-transparent>
    </div>
    <button btn-solid mxa mt2 @click="oauth()">
      Sign in
    </button>
  </div>
</template>
