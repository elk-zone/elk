<script setup lang="ts">
import Fuse from 'fuse.js'

const input = ref<HTMLInputElement | undefined>()
const knownServers = ref<string[]>([])
const autocompleteIndex = ref(0)
const autocompleteShow = ref(false)

const { busy, error, displayError, server, oauth } = useSignIn(input)

const fuse = shallowRef(new Fuse([] as string[]))

const filteredServers = computed(() => {
  if (!server.value)
    return []

  const results = fuse.value.search(server.value, { limit: 6 }).map(result => result.item)
  if (results[0] === server.value)
    return []

  return results
})

function isValidUrl(str: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(str)
    return true
  }
  catch {
    return false
  }
}

async function handleInput() {
  const input = server.value.trim()
  if (input.startsWith('https://'))
    server.value = input.replace('https://', '')

  if (input.length)
    displayError.value = false

  if (
    isValidUrl(`https://${input}`)
    && input.match(/^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?$/i)
    // Do not hide the autocomplete if a result has an exact substring match on the input
    && !filteredServers.value.some(s => s.includes(input))
  ) {
    autocompleteShow.value = false
  }

  else {
    autocompleteShow.value = true
  }
}

function toSelector(server: string) {
  return server.replace(/[^\w-]/g, '-')
}
function move(delta: number) {
  if (filteredServers.value.length === 0) {
    autocompleteIndex.value = 0
    return
  }
  autocompleteIndex.value = ((autocompleteIndex.value + delta) + filteredServers.value.length) % filteredServers.value.length
  document.querySelector(`#${toSelector(filteredServers.value[autocompleteIndex.value])}`)?.scrollIntoView(false)
}

function onEnter(e: KeyboardEvent) {
  if (autocompleteShow.value === true && filteredServers.value[autocompleteIndex.value]) {
    server.value = filteredServers.value[autocompleteIndex.value]
    e.preventDefault()
    autocompleteShow.value = false
  }
}

function escapeAutocomplete(evt: KeyboardEvent) {
  if (!autocompleteShow.value)
    return
  autocompleteShow.value = false
  evt.stopPropagation()
}

function select(index: number) {
  server.value = filteredServers.value[index]
}

onMounted(async () => {
  input?.value?.focus()
  knownServers.value = await (globalThis.$fetch as any)('/api/list-servers')
  fuse.value = new Fuse(knownServers.value, { shouldSort: true })
})

onClickOutside(input, () => {
  autocompleteShow.value = false
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
          @keydown.down="move(1)"
          @keydown.up="move(-1)"
          @keydown.enter="onEnter"
          @keydown.esc.prevent="escapeAutocomplete"
          @focus="autocompleteShow = true"
        >
        <div
          v-if="autocompleteShow && filteredServers.length"
          absolute left-6em right-0 top="100%"
          bg-base rounded border="~ base"
          z-10 shadow of-auto
          overflow-y-auto
          class="max-h-[8rem]"
        >
          <button
            v-for="(name, idx) in filteredServers"
            :id="toSelector(name)"
            :key="name"
            :value="name"
            px-2 py1 font-mono w-full text-left
            :class="autocompleteIndex === idx ? 'text-primary font-bold' : null"
            @click="select(idx)"
          >
            {{ name }}
          </button>
        </div>
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
