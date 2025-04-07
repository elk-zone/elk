<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const query = ref('')
const { accounts, hashtags, statuses, loading } = useSearch(query)
const route = useRoute()
const router = useRouter()
const userSettings = useUserSettings()

const searchInput = ref<HTMLInputElement | null>(null)

const MAX_VISIBLE_RESULTS = isTabletOrLarger ? 6 : 3

const visibleHashtagsCount = ref(MAX_VISIBLE_RESULTS)
const visibleAccountsCount = ref(MAX_VISIBLE_RESULTS)

const limitedHashtags = computed(() => hashtags.value.slice(0, visibleHashtagsCount.value))
const limitedAccounts = computed(() => accounts.value.slice(0, visibleAccountsCount.value))

const showMoreHashtags = function () {
  visibleHashtagsCount.value = visibleHashtagsCount.value + MAX_VISIBLE_RESULTS
}

const showMoreAccounts = function () {
  visibleAccountsCount.value = visibleAccountsCount.value + MAX_VISIBLE_RESULTS
}

const resultCount = computed(() => hashtags.value.length + accounts.value.length + statuses.value.length)

function updateQueryFromRoute() {
  const queryParam = route.query.q ? String(route.query.q) : ''
  query.value = queryParam
  visibleHashtagsCount.value = MAX_VISIBLE_RESULTS
  visibleAccountsCount.value = MAX_VISIBLE_RESULTS
}

onBeforeMount(() => {
  updateQueryFromRoute()
})

watch(route, () => {
  updateQueryFromRoute()
})

watch(query, (newQuery: string) => {
  router.replace({ query: { q: newQuery } })
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/search" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:search-line class="rtl-flip" />
        <span>{{ t('nav.search') }}</span>
      </NuxtLink>
    </template>
    <div px-2 mt-3>
      <!-- Search input -->
      <header group sticky top-18 md:top-9 z-10>
        <div
          border rounded-3 flex h-10 ps-4 pr-1 items-center relative focus-within:box-shadow-outline

          bg="[rgba(var(--rgb-bg-base),0.7)]"
          :class="{
            'backdrop-blur-md': !getPreferences(userSettings, 'optimizeForLowPerformanceDevice'),
          }"
        >
          <div v-if="loading" animate-spin preserve-3d i-ri:loader-2-line pointer-events-none text-secondary mt-1 />
          <div v-else i-ri:search-2-line pointer-events-none text-secondary />
          <input
            ref="searchInput"
            v-model="query"
            class="w-full bg-transparent px-3 ml-1 outline-none rounded-3"
            :placeholder="t('nav.search')"
            autofocus
          >
          <button v-if="query.length" btn-action-icon text-secondary @click="query = ''; searchInput?.focus()">
            <span aria-hidden="true" class="i-ri:close-line" />
          </button>
        </div>
      </header>
      <!-- Results -->
      <div my-8>
        <div v-if="loading && resultCount === 0" class="search-results mt-3">
          <SearchResultSkeleton v-for="n in 3" :key="n" />
        </div>
        <div v-else-if="resultCount > 0" flex flex-col gap-4 mt-3 class="search-results transition-opacity-300" :class="loading ? 'opacity-50' : ''">
          <!-- Results: Hashtags section -->
          <section>
            <div v-if="limitedHashtags.length > 0" grid md:grid-cols-2 gap-4>
              <SearchResult
                v-for="result in limitedHashtags"
                :key="result.id"
                :result="result"
                :active="false"
              />
              <button
                v-if="limitedHashtags.length < hashtags.length"
                md:col-span-2 p1 text-secondary text-center hover-underline focus-underline
                @click="showMoreHashtags"
              >
                {{ t('status.spoiler_show_more') }} {{ t('tab.hashtags').toLocaleLowerCase() }}
              </button>
            </div>
          </section>
          <!-- Results: Accounts section -->
          <section>
            <div v-if="limitedAccounts.length > 0" grid md:grid-cols-2 gap-4>
              <SearchResult
                v-for="result in limitedAccounts"
                :key="result.id"
                :result="result"
                :active="false"
              />
              <button
                v-if="limitedAccounts.length < accounts.length"
                md:col-span-2 p1 text-secondary text-center hover-underline focus-underline
                @click="showMoreAccounts"
              >
                {{ t('status.spoiler_show_more') }} {{ t('tab.accounts').toLocaleLowerCase() }}
              </button>
            </div>
          </section>
          <!-- Results: Posts section -->
          <section>
            <div v-if="statuses.length > 0">
              <SearchResult
                v-for="result in statuses"
                :key="result.id"
                :result="result"
                :active="false"
                :show-actions="true"
              />
            </div>
          </section>
          <div
            p5 text-secondary italic text-center
          >
            {{ t('common.end_of_list') }}
          </div>
        </div>
        <!-- No results -->
        <div
          v-else
          p5 mt4 text-secondary italic text-center
        >
          {{ t('search.search_empty') }}
        </div>
      </div>
    </div>
  </MainContent>
</template>
