<script setup lang="ts">
import { useAsyncIDBKeyval } from '~/composables/idb'
import { type AccountSearchResult, type HashTagSearchResult, type SavedSearchResult, type SearchResult } from '~/composables/masto/search'

import {
  STORAGE_KEY_SEARCH_HISTORY,
} from '~/constants'

const query = ref('')
const { accounts, hashtags, loading, statuses } = useSearch(query)
const index = ref(0)

const { t } = useI18n()
const el = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const router = useRouter()
const { focused } = useFocusWithin(el)

defineExpose({
  input,
})

const searchHistory = await useAsyncIDBKeyval<SavedSearchResult[]>(STORAGE_KEY_SEARCH_HISTORY, [], { deep: true })
const results = computed(() => {
  if (query.value.length === 0)
    return []

  const results = [
    ...hashtags.value.slice(0, 3),
    ...accounts.value,
    ...statuses.value,

    // Disable until search page is implemented
    // {
    //   type: 'action',
    //   to: `/search?q=${query.value}`,
    //   action: {
    //     label: `Search for ${query.value}`,
    //   },
    // },
  ]

  return results
})

// Reset index when results change
watch([results, focused], () => index.value = -1)

const shift = (delta: number) => index.value = (index.value + delta % results.value.length + results.value.length) % results.value.length

// Save to search history
function addToSearchHistory(result: SearchResult) {
  // check if searchHistory already contains result
  const index = searchHistory.value.findIndex(item => item.id === result.id)
  if (index !== -1)
    searchHistory.value.splice(index, 1)

  searchHistory.value.push({
    id: result.id,
    type: result.type,
    displayName: result.type === 'hashtag' ? (result as HashTagSearchResult).data.name : (result as AccountSearchResult).data.displayName,
    to: result.to,
    lastQueryTime: new Date(),
  })
}

const activate = () => {
  const currentIndex = index.value

  if (query.value.length === 0)
    return

  // Disable redirection until search page is implemented
  if (currentIndex === -1) {
    index.value = 0
    // router.push(`/search?q=${query.value}`)
    return
  }

  (document.activeElement as HTMLElement).blur()
  index.value = -1

  addToSearchHistory(results.value[currentIndex])
  router.push(results.value[currentIndex].to)
}
</script>

<template>
  <div ref="el" relative group>
    <div bg-base border="~ base" h10 px-4 rounded-3 flex="~ row" items-center relative focus-within:box-shadow-outline gap-3>
      <div i-ri:search-2-line pointer-events-none text-secondary mt="1px" class="rtl-flip" />
      <input
        ref="input"
        v-model="query"
        h-full
        rounded-3
        w-full
        bg-transparent
        outline="focus:none"
        pe-4
        ml-1
        :placeholder="isHydrated ? t('nav.search') : ''"
        pb="1px"
        placeholder-text-secondary
        @keydown.down.prevent="shift(1)"
        @keydown.up.prevent="shift(-1)"
        @keypress.enter="activate"
      >
    </div>
    <!-- Results -->
    <div left-0 top-11 absolute w-full z10 group-focus-within="pointer-events-auto visible" invisible pointer-events-none>
      <div w-full bg-base border="~ base" rounded-3 max-h-100 overflow-x-hidden py2>
        <template v-if="query.trim().length === 0">
          <SearchHistory
            :search-history="searchHistory"
            @clear-all="searchHistory = []"
            @clear-history-item="searchHistory = searchHistory.filter(item => item.id !== $event)"
          />
        </template>
        <template v-else-if="!loading">
          <template v-if="results.length > 0">
            <SearchResult
              v-for="(result, i) in results" :key="result.id"
              :active="index === parseInt(i.toString())"
              :result="result"
              :tabindex="focused ? 0 : -1"
              @activate="addToSearchHistory(result)"
            />
          </template>
          <span v-else block text-center text-sm text-secondary>
            {{ t('search.search_empty') }}
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
</template>
