<script setup lang="ts">
import AccountSearchResult from '~/components/list/AccountSearchResult.vue'

definePageMeta({
  name: 'list-accounts',
})

const inputRef = ref<HTMLInputElement>()
defineExpose({
  inputRef,
})

const params = useRoute().params
const listId = computed(() => params.list as string)

const $mastoList = useMastoClient().v1.lists.$select(listId.value).accounts
const paginator = $mastoList.list()
const accountsInList = ref((await useMastoClient().v1.lists.$select(listId.value).accounts.list({ limit: 0 })).map(account => account.id))
// console.log('>>> acccounts', accountsInList.value)

const paginatorRef = ref()

// search stuff
const query = ref('')
const el = ref<HTMLElement>()
const { accounts, loading } = useSearch(query, {
  following: true,
})
const { focused } = useFocusWithin(el)
const index = ref(0)

function isInCurrentList(userId: string) {
  return accountsInList.value.includes(userId)
}

const results = computed(() => {
  if (query.value.length === 0)
    return []
  return [...accounts.value]
})

// Reset index when results change
watch([results, focused], () => index.value = -1)

function shift(delta: number) {
  return index.value = (index.value + delta % results.value.length + results.value.length) % results.value.length
}

const actionError = false
function addAccount(id: string) {
  const newEntry = $mastoList.create({ accountIds: [id] })
  accountsInList.value.push(id)
  paginatorRef.value?.createEntry(newEntry)
}
function removeAccount(id: string) {
  $mastoList.remove({ accountIds: [id] })
  const index = accountsInList.value.indexOf(id)
  if (index > -1) {
    accountsInList.value.splice(index, 1)
    paginatorRef.value?.removeEntry(id)
    // console.log('remove', paginatorRef.value, id)
  }
}
</script>

<template>
  <!-- Search Accounts You Follow -->
  <div ref="el" relative group>
    <form
      border="t base"
      p-4 w-full
      flex="~ wrap" relative gap-3
      :aria-describedby="actionError ? 'create-list-error' : undefined"
      :class="actionError ? 'border border-base border-rounded rounded-be-is-0 rounded-be-ie-0 border-b-unset border-$c-danger-active' : null"
    >
      <div
        bg-base border="~ base" flex-1 h10 ps-1 pe-4 rounded-2 w-full flex="~ row"
        items-center relative focus-within:box-shadow-outline gap-3
        ps-4
      >
        <div i-ri:search-2-line pointer-events-none text-secondary mt="1px" class="rtl-flip" />
        <input
          ref="inputRef"
          v-model="query"
          bg-transparent
          outline="focus:none"
          ps-3
          rounded-3
          pb="1px"
          h-full
          w-full
          placeholder-text-secondary
          :placeholder="$t('list.search_following_placeholder')"
          @keydown.down.prevent="shift(1)"
          @keydown.up.prevent="shift(-1)"
          @keydown.esc.prevent="inputRef?.blur()"
        >
        <button v-if="query.length" btn-action-icon text-secondary @click="query = ''; inputRef?.focus()">
          <span aria-hidden="true" class="i-ri:close-line" />
        </button>
      </div>
    </form>

    <!-- Results -->
    <div left-0 top-18 absolute w-full z-10 group-focus-within="pointer-events-auto visible" invisible pointer-events-none>
      <div w-full bg-base border="~ base" rounded-3 max-h-100 overflow-auto py2>
        <span v-if="query.trim().length === 0" block text-center text-sm text-secondary>
          {{ $t('search.search_desc') }}
        </span>
        <template v-else-if="!loading">
          <template v-if="results.length > 0">
            <div
              v-for="(result, i) in results"
              :key="result.id"
              flex
              border="b base"
              py2 px4
              hover:bg-active justify-between transition-100 items-center
            >
              <AccountSearchResult
                :active="index === parseInt(i.toString())"
                :result="result"
                :tabindex="focused ? 0 : -1"
              />
              <button
                text-sm p2 border-1 transition-colors
                border-dark
                btn-action-icon
                @click=" () => isInCurrentList(result.id) ? removeAccount(result.id) : addAccount(result.id) "
              >
                <span :class="isInCurrentList(result.id) ? 'i-ri:user-unfollow-line' : 'i-ri:user-add-line'" />
              </button>
            </div>
          </template>
          <span v-else block text-center text-sm text-secondary>
            {{ $t('search.search_empty') }}
          </span>
        </template>
        <div v-else>
          <SearchResultSkeleton />
          <SearchResultSkeleton />
          <SearchResultSkeleton />
        </div>
      </div>
    </div>
  </div>

  <CommonPaginator ref="paginatorRef" :paginator="paginator">
    <template #default="{ item }">
      <ListAccount
        :account="item"
        :list="listId"
        hover-card
        border="b base" py2 px4
      />
    </template>
  </CommonPaginator>
</template>
