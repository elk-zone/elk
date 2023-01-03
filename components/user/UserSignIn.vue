<script setup lang="ts">
import Fuse from 'fuse.js'
import { $fetch } from 'ofetch'

const masto = useMasto()

const input = $ref<HTMLInputElement>()
let server = $ref<string>('')
let busy = $ref<boolean>(false)
let error = $ref<boolean>(false)
let displayError = $ref<boolean>(false)
let knownServers = $ref<string[]>([])
let autocompleteIndex = $ref(0)
let autocompleteShow = $ref(false)

async function oauth() {
  if (busy)
    return

  busy = true
  error = false
  displayError = false

  await nextTick()

  if (server)
    server = server.split('/')[0]

  try {
    location.href = await $fetch<string>(`/api/${server}/login`, {
      method: 'POST',
      body: {
        origin: location.origin,
      },
    })
  }
  catch {
    displayError = true
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

async function explore() {
  await masto.loginTo({ server, guest: true })
  isSigninDialogOpen.value = false
}

async function handleInput() {
  if (server.startsWith('https://'))
    server = server.replace('https://', '')

  if (server?.length)
    displayError = false
}

let fuse = $shallowRef(new Fuse([] as string[]))

const filteredServers = $computed(() => {
  if (!server)
    return []

  const results = fuse.search(server, { limit: 6 }).map(result => result.item)
  if (results[0] === server)
    return []

  return results
})

function toSelector(server: string) {
  return server.replace(/[^\w-]/g, '-')
}
function move(delta: number) {
  autocompleteIndex = ((autocompleteIndex + delta) + filteredServers.length) % filteredServers.length
  document.querySelector(`#${toSelector(filteredServers[autocompleteIndex])}`)?.scrollIntoView(false)
}

function onEnter(e: KeyboardEvent) {
  if (autocompleteShow === true && filteredServers[autocompleteIndex]) {
    server = filteredServers[autocompleteIndex]
    e.preventDefault()
    autocompleteShow = false
  }
}

function escapeAutocomplete(evt: KeyboardEvent) {
  if (!autocompleteShow)
    return
  autocompleteShow = false
  evt.stopPropagation()
}

function select(index: number) {
  server = filteredServers[index]
}

onMounted(async () => {
  input?.focus()
  knownServers = await $fetch('/api/list-servers')
  fuse = new Fuse(knownServers, { shouldSort: true })
})

onClickOutside($$(input), () => {
  autocompleteShow = false
})
</script>

<template>
  <form text-center justify-center items-center max-w-150 py6 flex="~ col gap-3" @submit.prevent="oauth">
    <div flex="~ center" items-end mb2 gap-x-2>
      <img src="/logo.svg" w-12 h-12 mxa height="48" width="48" :alt="$t('app_logo')" class="rtl-flip">
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
          <a href="https://joinmastodon.org/servers" target="_blank" hover="underline text-primary">{{ $t('user.tip_register_account') }}</a>
        </i18n-t>
      </span>
    </div>
    <div flex="~ gap2" mt2 items-center>
      <button
        type="button"
        flex="~ row" gap-x-2 items-center btn-outline text-sm px2 py1 h-fit :disabled="!server || busy"
        @click="explore"
      >
        <span aria-hidden="true" inline-block :class="busy ? 'i-ri:loader-2-fill animate animate-spin' : 'i-ri:user-4-line'" />
        {{ $t('action.explore_as_a_guest') }}
      </button>
      <button flex="~ row" gap-x-2 items-center btn-solid :disabled="!server || busy">
        <span aria-hidden="true" inline-block :class="busy ? 'i-ri:loader-2-fill animate animate-spin' : 'i-ri:login-circle-line'" class="rtl-flip" />
        {{ $t('action.sign_in') }}
      </button>
    </div>
  </form>
</template>
