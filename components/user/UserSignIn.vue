<script setup lang="ts">
import { DEFAULT_SERVER } from '~/constants'

let server = $ref<string>('')

async function oauth() {
  server = server.split('/')[0]
  location.href = `/api/${server || DEFAULT_SERVER}/login`
}

async function handleInput() {
  if (server.startsWith('https://'))
    server = server.replace('https://', '')
}
</script>

<template>
  <div text-center justify-center items-center flex="~ col gap2">
    <div text-3xl mb2>
      Sign in
    </div>
    <div>Mastodon Server Name</div>
    <div flex bg-gray:10 px2 py1 mxa rounded border="~ border" text-xl items-center>
      <span op35 mr1 text-sm>https://</span>
      <input v-model="server" :placeholder="DEFAULT_SERVER" outline-none bg-transparent @input="handleInput" @keyup.enter="oauth()">
    </div>
    <button btn-solid mt2 @click="oauth()">
      Sign in
    </button>
  </div>
</template>
