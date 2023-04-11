<script setup lang="ts">
const { createCallback } = defineProps<{
  createButtonIcon: string
  placeholder: string
  id: string
  createCallback(text: string): Promise<void>
}>()

let actionError = $ref<string | undefined>(undefined)
const inputRef = ref()
let busy = $ref<boolean>(false)
const createText = ref('')
const enableSubmit = computed(() => createText.value.length > 0)

async function create() {
  if (busy || !enableSubmit.value)
    return

  busy = true
  actionError = undefined
  await nextTick()
  try {
    await createCallback(createText.value)
    createText.value = ''
  }
  catch (err) {
    console.error(err)
    actionError = (err as Error).message
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
  finally {
    busy = false
  }
}

function clearError(focusBtn: boolean) {
  actionError = undefined

  if (focusBtn) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

onDeactivated(() => clearError(false))
</script>

<template>
  <form
    py-4 w-full
    flex="~ wrap" relative gap-3
    :aria-describedby="actionError ? `create-${id}-failed` : undefined"
    :class="actionError ? 'border border-base border-rounded rounded-be-is-0 rounded-be-ie-0 border-b-unset border-$c-danger-active' : null"
    @submit.prevent="create"
  >
    <div
      bg-base border="~ base" flex-1 h10 ps-1 pe-4 rounded-2 w-full flex="~ row"
      items-center relative focus-within:box-shadow-outline gap-3
    >
      <input
        ref="inputRef"
        v-model="createText"
        bg-transparent
        outline="focus:none"
        px-4
        pb="1px"
        flex-1
        placeholder-text-secondary
        :placeholder="placeholder"
        @keypress.enter="create"
      >
    </div>
    <div flex="~ col" gap-y-4 gap-x-2 sm="~ justify-between flex-row">
      <button flex="~ row" gap-x-2 items-center btn-solid :disabled="!enableSubmit || busy">
        <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
          <span block i-ri:loader-2-fill aria-hidden="true" />
        </span>
        <span v-else aria-hidden="true" block :class="createButtonIcon" class="rtl-flip" />
        {{ $t('list_create.create') }}
      </button>
    </div>
  </form>
  <CommonErrorMessage
    v-if="actionError"
    :id="`create-${id}-error`"
    :described-by="`create-${id}-failed`"
    class="rounded-bs-is-0 rounded-bs-ie-0 border-t-dashed m-b-2"
  >
    <header :id="`create-${id}-failed`" flex justify-between>
      <div flex items-center gap-x-2 font-bold>
        <div aria-hidden="true" i-ri:error-warning-fill />
        <p>
          <slot name="error-text" />
        </p>
      </div>
      <CommonTooltip placement="bottom" :content="$t('list_create.errors.clear')" no-auto-focus>
        <button
          flex rounded-4 p1 hover:bg-active cursor-pointer transition-100 :aria-label="$t('list_create.errors.clear')"
          @click="clearError(true)"
        >
          <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
        </button>
      </CommonTooltip>
    </header>
    <ol ps-2 sm:ps-1>
      <li flex="~ col sm:row" gap-y-1 sm:gap-x-2>
        <strong sr-only>{{ $t('list_create.errors.screen_reader_prefix') }}</strong>
        <span>{{ actionError }}</span>
      </li>
    </ol>
  </CommonErrorMessage>
</template>
