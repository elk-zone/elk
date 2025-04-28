<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { showActions = false, focusedOnResults = true, query, results, index } = defineProps<{
  results: SearchResult[]
  query: string
  focusedOnResults?: boolean
  showActions?: boolean
  index?: number
}>()

const { loading } = useSearch(query)
const { t } = useI18n()
</script>

<template>
  <span v-if="query.trim().length === 0" block text-center text-sm text-secondary>
    {{ t('search.search_desc') }}
  </span>
  <template v-else-if="!loading">
    <template v-if="results.length > 0">
      <SearchResult
        v-for="(result, i) in results" :key="result.id"
        :active="index === parseInt(i.toString())"
        :result="result"
        :tabindex="focusedOnResults ? 0 : -1"
        :show-actions="showActions"
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
</template>
