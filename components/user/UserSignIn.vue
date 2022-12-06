<script setup lang="ts">
import { DEFAULT_SERVER } from '~/constants'

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
  <form text-center justify-center items-center max-w-150 py6 flex="~ col gap-3" @submit.prevent="oauth">
    <div flex="~ center" mb2>
      <img src="/logo.svg" w-12 h-12 mxa height="48" width="48" alt="logo">
      <div text-3xl>
        {{ $t('action.sign_in') }}
      </div>
    </div>
    <div>{{ $t('user.server_address_label') }}</div>
    <div flex bg-gray:10 px4 py2 mxa rounded border="~ base" items-center font-mono focus:outline-none focus:ring="2 primary inset">
      <span text-secondary-light mr1>https://</span>
      <input ref="input" v-model="server" outline-none bg-transparent w-full max-w-50 @input="handleInput">
    </div>
    <div text-secondary text-sm flex>
      <div i-ri:lightbulb-line mr-1 />
      <span>
        <i18n-t keypath="user.tip_no_account">
          <a href="https://joinmastodon.org/servers" target="_blank" hover="underline text-primary">{{ $t('user.tip_register_account') }}</a>
        </i18n-t>
      </span>
    </div>
    <button btn-solid mt2 :disabled="!server">
      {{ $t('action.sign_in') }}
    </button>
  </form>
</template>
