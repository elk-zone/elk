<script setup lang="ts">
const input = ref<HTMLInputElement | undefined>()

const { busy, error, displayError, server, oauth } = useSignIn(input)

async function handleInput() {
  const input = server.value.trim()
  if (input.startsWith('https://'))
    server.value = input.replace('https://', '')

  if (input.length)
    displayError.value = false
}

onMounted(async () => {
  input?.value?.focus()
})
</script>

<template>
  <form text-center justify-center items-center max-w-150 py6 flex="~ col gap-3" @submit.prevent="oauth">
    <div flex="~ center" items-end mb2 gap-x-2>
      <img :src="`/${''}logo.svg`" w-12 h-12 mxa height="48" width="48" :alt="$t('app_logo')" class="rtl-flip">
      <div text-3xl>
        {{ $t('action.sign_in') }}
      </div>
    </div>
    <div>
      {{ $t('user.server_address_label') }}
    </div>
    <div :class="error ? 'animate animate-shake-x animate-delay-100' : null">
      <div
        dir="ltr"
        flex bg-gray:10 px4 py2 mxa rounded
        border="~ base" items-center font-mono
        focus:outline-none focus:ring="2 primary inset"
        relative
        :class="displayError ? 'border-red-600 dark:border-red-400' : null"
      >
        <span text-secondary-light me1>https://</span>

        <input
          ref="input"
          v-model="server"
          autocapitalize="off"
          inputmode="url"
          outline-none bg-transparent w-full max-w-50
          spellcheck="false"
          autocorrect="off"
          autocomplete="off"
          @input="handleInput"
        >
      </div>
      <div min-h-4>
        <Transition css enter-active-class="animate animate-fade-in">
          <p v-if="displayError" role="alert" p-0 m-0 text-xs text-red-600 dark:text-red-400>
            {{ $t('error.sign_in_error') }}
          </p>
        </Transition>
      </div>
    </div>
    <div text-secondary text-sm flex>
      <div i-ri:lightbulb-line me-1 />
      <span>
        <i18n-t keypath="user.tip_no_account">
          <NuxtLink href="https://joinmastodon.org/servers" target="_blank" external class="text-primary" hover="underline">{{ $t('user.tip_register_account') }}</NuxtLink>
        </i18n-t>
      </span>
    </div>
    <button flex="~ row" gap-x-2 items-center btn-solid mt2 :disabled="!server || busy">
      <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
        <span block i-ri:loader-2-fill aria-hidden="true" />
      </span>
      <span v-else aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      {{ $t('action.sign_in') }}
    </button>
  </form>
</template>
