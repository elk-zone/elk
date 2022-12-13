<script setup lang="ts">
import { DEFAULT_SERVER } from '~/constants'

const input = $ref<HTMLInputElement>()
let server = $ref<string>('')
let busy = $ref(false)
let error = $ref(false)
let showError = $ref(false)

async function oauth() {
  if (busy)
    return

  busy = true
  error = false
  showError = false

  if (server)
    server = server.split('/')[0]

  try {
    location.href = await $fetch(`/api/${server || DEFAULT_SERVER}/login`)
  }
  catch {
    showError = true
    error = true
    await nextTick()
    input?.focus()
    await nextTick()
    setTimeout(() => {
      busy = false
      error = false
    }, 512)
  }
}

async function handleInput() {
  if (server.startsWith('https://'))
    server = server.replace('https://', '')

  if (server.length > 0)
    showError = false
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
    <div>
      {{ $t('user.server_address_label') }}
    </div>
    <div :class="error ? 'animate animate-shake-x animate-delay-100' : null">
      <div
        flex bg-gray:10 px4 py2 mxa rounded
        border="~ base" items-center font-mono
        focus:outline-none focus:ring="2 primary inset"
        :class="showError ? 'border-red-600 dark:border-red-400' : null"
      >
        <span text-secondary-light mr1>https://</span>
        <input
          ref="input"
          v-model="server"
          outline-none bg-transparent w-full max-w-50
          @input="handleInput"
        >
      </div>
      <div min-h-4>
        <Transition css enter-active-class="animate animate-fade-in">
          <p v-if="showError" role="alert" p-0 m-0 text-xs text-red-600 dark:text-red-400>
            {{ $t('error.sign_in_error') }}
          </p>
        </Transition>
      </div>
    </div>
    <div text-secondary text-sm flex>
      <div i-ri:lightbulb-line mr-1 />
      <span>
        <i18n-t keypath="user.tip_no_account">
          <a href="https://joinmastodon.org/servers" target="_blank" hover="underline text-primary">{{ $t('user.tip_register_account') }}</a>
        </i18n-t>
      </span>
    </div>
    <button flex="~ row" gap-x-2 items-center btn-solid mt2 :disabled="!server || busy">
      <span aria-hidden="true" inline-block :class="busy ? 'i-ri:loader-2-fill animate animate-spin' : 'i-ri:login-circle-line'" />
      {{ $t('action.sign_in') }}
    </button>
  </form>
</template>
