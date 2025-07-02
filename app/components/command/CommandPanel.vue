<script setup lang="ts">
import type { CommandScope, QueryResult, QueryResultItem } from '~/composables/command'
import type { SearchResult as SearchResultType } from '~/composables/masto/search'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const registry = useCommandRegistry()

const router = useRouter()

const inputEl = ref<HTMLInputElement>()
const resultEl = ref<HTMLDivElement>()

const scopes = ref<CommandScope[]>([])
const input = commandPanelInput

onMounted(() => {
  inputEl.value?.focus()
})

const commandMode = computed(() => input.value.startsWith('>'))

const query = computed(() => commandMode.value ? '' : input.value.trim())

const { accounts, hashtags, loading } = useSearch(query)

function toSearchQueryResultItem(search: SearchResultType): QueryResultItem {
  return {
    index: 0,
    type: 'search',
    search,
    onActivate: () => router.push(search.to),
  }
}

const searchResult = computed<QueryResult>(() => {
  if (query.value.length === 0 || loading.value)
    return { length: 0, items: [], grouped: {} as any }

  // TODO extract this scope
  // duplicate in SearchWidget.vue
  const hashtagList = hashtags.value.slice(0, 3).map(toSearchQueryResultItem)
  const accountList = accounts.value.map(toSearchQueryResultItem)

  const grouped: QueryResult['grouped'] = new Map()
  grouped.set('Hashtags', hashtagList)
  grouped.set('Users', accountList)

  let index = 0
  for (const items of grouped.values()) {
    for (const item of items)
      item.index = index++
  }

  return {
    grouped,
    items: [...hashtagList, ...accountList],
    length: hashtagList.length + accountList.length,
  }
})

const result = computed<QueryResult>(() => commandMode.value
  ? registry.query(scopes.value.map(s => s.id).join('.'), input.value.slice(1).trim())
  : searchResult.value,
)

const isMac = useIsMac()
const modifierKeyName = computed(() => isMac.value ? '⌘' : 'Ctrl')

const active = ref(0)
watch(result, (n, o) => {
  if (n.length !== o.length || !n.items.every((i, idx) => i === o.items[idx]))
    active.value = 0
})

function findItemEl(index: number) {
  return resultEl.value?.querySelector(`[data-index="${index}"]`) as HTMLDivElement | null
}
function onCommandActivate(item: QueryResultItem) {
  if (item.onActivate) {
    item.onActivate()
    emit('close')
  }
  else if (item.onComplete) {
    scopes.value.push(item.onComplete())
    input.value = '> '
  }
}
function onCommandComplete(item: QueryResultItem) {
  if (item.onComplete) {
    scopes.value.push(item.onComplete())
    input.value = '> '
  }
  else if (item.onActivate) {
    item.onActivate()
    emit('close')
  }
}
function intoView(index: number) {
  const el = findItemEl(index)
  if (el)
    el.scrollIntoView({ block: 'nearest' })
}

function setActive(index: number) {
  const len = result.value.length
  active.value = (index + len) % len
  intoView(active.value)
}

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'p':
    case 'ArrowUp': {
      if (e.key === 'p' && !e.ctrlKey)
        break
      e.preventDefault()

      setActive(active.value - 1)

      break
    }
    case 'n':
    case 'ArrowDown': {
      if (e.key === 'n' && !e.ctrlKey)
        break
      e.preventDefault()

      setActive(active.value + 1)

      break
    }

    case 'Home': {
      e.preventDefault()

      active.value = 0

      intoView(active.value)

      break
    }

    case 'End': {
      e.preventDefault()

      setActive(result.value.length - 1)

      break
    }

    case 'Enter': {
      e.preventDefault()

      const cmd = result.value.items[active.value]
      if (cmd)
        onCommandActivate(cmd)

      break
    }

    case 'Tab': {
      e.preventDefault()

      const cmd = result.value.items[active.value]
      if (cmd)
        onCommandComplete(cmd)

      break
    }

    case 'Backspace': {
      if (input.value === '>' && scopes.value.length) {
        e.preventDefault()
        scopes.value.pop()
      }
      break
    }
  }
}
</script>

<template>
  <div class="flex flex-col w-50vw max-w-180 h-50vh max-h-120">
    <!-- Input -->
    <label class="flex mx-3 my-1 items-center">
      <div mx-1 i-ri:search-line />

      <div v-for="scope in scopes" :key="scope.id" class="flex items-center mx-1 gap-2">
        <div class="text-sm">{{ scope.display }}</div>
        <span class="text-secondary">/</span>
      </div>

      <input
        ref="inputEl"
        v-model="input"
        class="focus:outline-none flex-1 p-2 rounded bg-base"
        placeholder="Search"
        @keydown="onKeyDown"
      >

      <CommandKey name="Escape" />
    </label>

    <div class="w-full border-b-1 border-base" />

    <!-- Results -->
    <div ref="resultEl" class="flex-1 mx-1 overflow-y-auto">
      <template v-if="loading">
        <SearchResultSkeleton />
        <SearchResultSkeleton />
        <SearchResultSkeleton />
      </template>
      <template v-else-if="result.length">
        <template v-for="[scope, group] in result.grouped" :key="scope">
          <div class="mt-2 px-2 py-1 text-sm text-secondary">
            {{ scope }}
          </div>

          <template v-for="item in group" :key="item.index">
            <SearchResult v-if="item.type === 'search'" :active="active === item.index" :result="item.search" />
            <CommandItem v-else :index="item.index" :cmd="item.cmd" :active="active === item.index" @activate="onCommandActivate(item)" />
          </template>
        </template>
      </template>
      <div v-else p5 text-center text-secondary italic>
        {{
          input.trim().length
            ? $t('common.not_found')
            : $t('search.search_desc')
        }}
      </div>
    </div>

    <div class="w-full border-b-1 border-base" />

    <!-- Footer -->
    <div class="flex items-center px-3 py-1 text-xs">
      <div i-ri:lightbulb-flash-line /> Tip: Use
      <CommandKey :name="`${modifierKeyName}+K`" /> to search,
      <CommandKey :name="`${modifierKeyName}+/`" /> to activate command mode.
    </div>
  </div>
</template>
