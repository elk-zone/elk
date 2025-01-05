<script lang="ts" setup>
const input = ref<HTMLInputElement>()
const tabs = computed(() => [
  {
    name: 'all',
    display: 'All',
  },
  {
    name: 'accounts',
    display: 'People',
  },
  {
    name: 'statuses',
    display: 'Statuses',
  },
  {
    name: 'hashtags',
    display: 'Hashtags',
  },
])

const currentTab = ref(tabs.value[0].name)

const { q } = useUrlSearchParams<{ q: string }>()

const query = ref(q || '')
const options = computed(() => ({ type: currentTab.value === 'all' ? undefined : currentTab.value as ('accounts' | 'hashtags' | 'statuses') }))

const { loading, next, ...results } = useSearch(query, options)

const currentResults = computed(() => {
  if (query.value.length === 0)
    return []

  return !options.value.type
    ? [
        ...results.hashtags.value.slice(0, 5),
        ...results.accounts.value.slice(0, 5),
        ...results.statuses.value,
      ]
    : results[options.value.type].value
})
</script>

<template>
  <div bg-base border="~ base" h10 ps-4 pe-1 rounded-3 flex="~ row" items-center relative focus-within:box-shadow-outline>
    <div i-ri:search-2-line pointer-events-none text-secondary mt="1px" class="rtl-flip" />
    <input
      ref="input"
      v-model="query"
      h-full
      rounded-3
      w-full
      bg-transparent
      outline="focus:none"
      ps-3
      pe-1
      ml-1
      :placeholder="$t('nav.search')"
      pb="1px"
      placeholder-text-secondary
    >
    <button v-if="query.length" btn-action-icon text-secondary @click="query = ''; input?.focus()">
      <span aria-hidden="true" class="i-ri:close-line" />
    </button>
  </div>
  <CommonTabs v-model="currentTab" :options="tabs" command />
  <span v-if="query.trim().length === 0" block text-center text-sm text-secondary>
    {{ $t('search.search_desc') }}
  </span>
  <template v-else>
    <template v-if="currentResults.length > 0">
      <SearchResult
        v-for="(result) in currentResults" :key="result.id"
        :active="false"
        :result="result"
      />
    </template>
    <span v-else-if="!loading" block text-center text-sm text-secondary>
      {{ $t('search.search_empty') }}
    </span>
  </template>
  <div v-if="loading">
    <SearchResultSkeleton />
    <SearchResultSkeleton />
    <SearchResultSkeleton />
  </div>
  <button
    mt-3
    mb-5
    mx-auto
    flex
    gap-1
    items-center
    type="button"
    rounded-full text-sm py-2 px-3 border-1
    hover:text-primary transition-colors
    :class="loading ? 'opacity-50' : ''"
    :disabled="loading"
    @click="next"
  >
    <div :class="loading ? 'i-ri:loop-right-line animate-spin' : 'i-ri:search-line'" />
    Load
    more
  </button>
</template>
