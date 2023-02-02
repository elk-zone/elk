<script lang="ts" setup>
import type { mastodon } from 'masto'

const { t } = useI18n()

const client = useMastoClient()

const paginator = client.v1.lists.list()

useHeadFixed({
  title: () => t('nav.lists'),
})

const paginatorRef = ref()
let busy = $ref<boolean>(false)
const createText = ref('')
const enableSubmit = computed(() => createText.value.length > 0)

async function createList() {
  if (busy || !enableSubmit.value)
    return

  busy = true
  await nextTick()
  try {
    const newEntry = await client.v1.lists.create({
      title: createText.value,
    })
    paginatorRef.value.createEntry(newEntry)
    createText.value = ''
  }
  finally {
    busy = false
  }
}
function updateEntry(list: mastodon.v1.List) {
  paginatorRef.value.updateEntry(list)
}
function removeEntry(id: string) {
  paginatorRef.value.removeEntry(id)
}
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
            :list="item"
            @list-updated="updateEntry"
            @list-removed="removeEntry"
          />
        </template>
        <template #done>
          <form
            bg-base border="t base"
            p-4 w-full
            flex="~ col" relative gap-3
            @submit.prevent="createList"
          >
            <input
              v-model="createText"
              outline-none bg-transparent w-full max-w-50
              placeholder-text-secondary
              rounded-3
              outline="focus:none"
              pe-4
              pb="1px"
              :placeholder="$t('list.create')"
              @keypress.enter="createList"
            >
            <div flex="~ col" gap-y-4 gap-x-2 py-1 sm="~ justify-between flex-row">
              <button flex="~ row" gap-x-2 items-center btn-solid mt2 :disabled="!enableSubmit || busy">
                <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
                  <span block i-ri:loader-2-fill aria-hidden="true" />
                </span>
                <span v-else aria-hidden="true" block i-material-symbols:playlist-add-rounded class="rtl-flip" />
                {{ $t('list.create') }}
              </button>
            </div>
          </form>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
