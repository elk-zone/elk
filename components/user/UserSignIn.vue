<script setup lang="ts">
import { DEFAULT_SERVER } from '~/constants'

const { t } = useI18n()

const input = $ref<HTMLInputElement>()
let server = $ref<string>('')

async function oauth() {
  if (server)
    server = server.split('/')[0]
  location.href = `/api/${server || DEFAULT_SERVER}/login`
}

async function handleInput() {
  if (server.startsWith('https://'))
    server = server.replace('https://', '')
}

onMounted(() => {
  input?.focus()
})
</script>

<template>
  <form text-center justify-center items-center flex="~ col gap2" @submit.prevent="oauth">
    <div text-3xl mb2>
      {{ $t('action.sign_in') }}
    </div>
    <div>{{ $t('account.mastodon_server_name') }}</div>
    <div flex bg-gray:10 px2 py1 mxa rounded border="~ border" text-xl items-center>
      <span text-secondary-light mr1 text-sm>https://</span>
      <input ref="input" v-model="server" :placeholder="DEFAULT_SERVER" outline-none bg-transparent @input="handleInput">
    </div>
    <button btn-solid mt2>
      {{ $t('action.sign_in') }}
    </button>
  </form>
</template>
