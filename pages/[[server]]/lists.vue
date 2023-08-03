<script lang="ts" setup>
import type { mastodon } from 'masto'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const client = useMastoClient()

const paginator = client.v1.lists.list()

useHydratedHead({
  title: () => t('nav.lists'),
})

const paginatorRef = ref()
const inputRef = ref<HTMLInputElement>()
let actionError = $ref<string | undefined>(undefined)
let busy = $ref<boolean>(false)
const createText = ref('')
const enableSubmit = computed(() => createText.value.length > 0)

async function createList() {
  if (busy || !enableSubmit.value)
    return

  busy = true
  actionError = undefined
  await nextTick()
  try {
    const newEntry = await client.v1.lists.create({
      title: createText.value,
    })
    paginatorRef.value?.createEntry(newEntry)
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
  focusBtn && nextTick(() => {
    inputRef.value?.focus()
  })
}

function updateEntry(list: mastodon.v1.List) {
  paginatorRef.value?.updateEntry(list)
}
function removeEntry(id: string) {
  paginatorRef.value?.removeEntry(id)
}

onDeactivated(() => clearError(false))
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/lists" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:list-check />
        <span text-lg font-bold>{{ t('nav.lists') }}</span>
      </NuxtLink>
    </template>
    <slot>
      <CommonPaginator ref="paginatorRef" :paginator="paginator">
        <template #default="{ item }">
          <ListEntry
            :model-value="item"
            @update:model-value="updateEntry"
            @list-removed="removeEntry"
          />
        </template>
        <template #done>
          <form
            border="t base"
            p-4 w-full
            flex="~ wrap" relative gap-3
            :aria-describedby="actionError ? 'create-list-error' : undefined"
            :class="actionError ? 'border border-base border-rounded rounded-be-is-0 rounded-be-ie-0 border-b-unset border-$c-danger-active' : null"
            @submit.prevent="createList"
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
                :placeholder="$t('list.list_title_placeholder')"
                @keypress.enter="createList"
              >
            </div>
            <div flex="~ col" gap-y-4 gap-x-2 sm="~ justify-between flex-row">
              <button flex="~ row" gap-x-2 items-center btn-solid :disabled="!enableSubmit || busy">
                <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
                  <span block i-ri:loader-2-fill aria-hidden="true" />
                </span>
                <span v-else aria-hidden="true" block i-material-symbols:playlist-add-rounded class="rtl-flip" />
                {{ $t('list.create') }}
              </button>
            </div>
          </form>
          <CommonErrorMessage
            v-if="actionError"
            id="create-list-error"
            described-by="create-list-failed"
            class="rounded-bs-is-0 rounded-bs-ie-0 border-t-dashed m-b-2"
          >
            <header id="create-list-failed" flex justify-between>
              <div flex items-center gap-x-2 font-bold>
                <div aria-hidden="true" i-ri:error-warning-fill />
                <p>{{ $t('list.error') }}</p>
              </div>
              <CommonTooltip placement="bottom" :content="$t('list.clear_error')" no-auto-focus>
                <button
                  flex rounded-4 p1 hover:bg-active cursor-pointer transition-100 :aria-label="$t('list.clear_error')"
                  @click="clearError(true)"
                >
                  <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
                </button>
              </CommonTooltip>
            </header>
            <ol ps-2 sm:ps-1>
              <li flex="~ col sm:row" gap-y-1 sm:gap-x-2>
                <strong sr-only>{{ $t('list.error_prefix') }}</strong>
                <span>{{ actionError }}</span>
              </li>
            </ol>
          </CommonErrorMessage>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
