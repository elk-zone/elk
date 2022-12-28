<script setup lang="ts">
const query = ref('')
const { accounts, hashtags, loading } = useSearch(query)
const index = ref(0)

const { t } = useI18n()
const el = ref<HTMLElement>()
const router = useRouter()
const { focused } = useFocusWithin(el)

const results = computed(() => {
  if (query.value.length === 0)
    return []

  const results = [
    ...hashtags.value.slice(0, 3).map(hashtag => ({ type: 'hashtag', hashtag, to: `/tags/${hashtag.name}` })),
    ...accounts.value.map(account => ({ type: 'account', account, to: `/@${account.acct}` })),

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

const activate = () => {
  (document.activeElement as HTMLElement).blur()
  const currentIndex = index.value
  index.value = -1

  if (query.value.length === 0)
    return

  // Disable until search page is implemented
  // if (currentIndex === -1)
  //   router.push(`/search?q=${query.value}`)

  router.push(results.value[currentIndex].to)
}
</script>

<template>
  <div ref="el" relative px4 py2 group>
    <div bg-base border="~ base" h10 rounded-full flex="~ row" items-center relative outline-primary outline-1 focus-within:outline>
      <div i-ri:search-2-line mx4 absolute pointer-events-none text-secondary mt="1px" />
      <input
        ref="input"
        v-model="query"
        h-full
        pl-10
        rtl-pr-10
        rounded-full
        w-full
        bg-transparent
        outline="focus:none"
        pr-4
        rtl-pl-4
        :placeholder="t('nav.search')"
        pb="1px"
        placeholder-text-secondary
        @keydown.down.prevent="shift(1)"
        @keydown.up.prevent="shift(-1)"
        @keypress.enter="activate"
      >
    </div>
    <!-- Results -->
    <div p4 left-0 top-10 absolute w-full z10 group-focus-within="pointer-events-auto visible" invisible pointer-events-none>
      <div w-full bg-base border="~ base" rounded max-h-100 overflow-auto py2>
        <span v-if="query.length === 0" block text-center text-sm text-secondary>
          {{ t('search.search_desc') }}
        </span>
        <template v-if="!loading">
          <SearchResult v-for="(result, i) in results" :key="result.to" :active="index === parseInt(i.toString())" :result="result" :tabindex="focused ? 0 : -1" />
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
