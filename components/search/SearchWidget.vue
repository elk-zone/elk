<script setup lang="ts">
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

function shift(delta: number) {
  return index.value = (index.value + delta % results.value.length + results.value.length) % results.value.length
}

function activate() {
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

  router.push(results.value[currentIndex].to)
}
</script>

<template>
  <div ref="el" relative group>
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
        :placeholder="t('nav.search')"
        pb="1px"
        placeholder-text-secondary
        @keydown.down.prevent="shift(1)"
        @keydown.up.prevent="shift(-1)"
        @keydown.esc.prevent="input?.blur()"
        @keypress.enter="activate"
      >
      <button v-if="query.length" btn-action-icon text-secondary @click="query = ''; input?.focus()">
        <span aria-hidden="true" class="i-ri:close-line" />
      </button>
    </div>
    <!-- Results -->
    <div left-0 top-11 absolute w-full z-10 group-focus-within="pointer-events-auto visible" invisible pointer-events-none>
      <div w-full bg-base border="~ base" rounded-3 max-h-100 overflow-auto py2>
        <span v-if="query.trim().length === 0" block text-center text-sm text-secondary>
          {{ t('search.search_desc') }}
        </span>
        <template v-else-if="!loading">
          <template v-if="results.length > 0">
            <SearchResult
              v-for="(result, i) in results" :key="result.id"
              :active="index === parseInt(i.toString())"
              :result="result"
              :tabindex="focused ? 0 : -1"
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
