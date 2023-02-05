<script setup lang="ts">
import type { SavedSearchResult } from '@/composables/masto/search'

const props = defineProps<{
  searchHistory: SavedSearchResult[]
}>()

const emit = defineEmits<{
  (event: 'clear-all'): void
  (event: 'clear-history-item', id: string): void
}>()

const orderedHistoryItems = computed(() => {
  return [...props.searchHistory].sort((a, b) => new Date(b.lastQueryTime).getTime() - new Date(a.lastQueryTime).getTime())
})
</script>

<template>
  <div left-0 top-12 w-full group-focus-within="pointer-events-auto visible" pointer-events-none>
    <div class="grid grid-cols-[1fr_auto] place-items-center mx-2 mb-2">
      <div justify-self-start text-xl font-500>
        {{ $t('search.search_history_title') }}
      </div>
      <button
        gap-1 items-center
        border-1
        rounded-full flex="~ gap2 center" font-400 px3 py1
        bg-base border-primary text-primary
        hover="text-inverted bg-primary border-primary"
        @click="emit('clear-all')"
      >
        <span>{{ $t('search.search_clear_all') }}</span>
      </button>
    </div>
    <div mx-2 class="grid grid-gap-1" overflow-x-hidden max-h-50>
      <div v-for="searcHistoryItem in orderedHistoryItems" :key="searcHistoryItem.id" hover="bg-active" class="grid grid-cols-[auto_1fr_auto] place-items-center grid-gap-2">
        <div v-if="searcHistoryItem.type === 'hashtag'" i-ri:hashtag />
        <div v-else i-ri:user-search-line />
        <NuxtLink :to="searcHistoryItem.to" justify-self-start w-full>
          <div>
            {{ searcHistoryItem.displayName }}
          </div>
        </NuxtLink>
        <button btn-action-icon :aria-label="$t('tooltip.delete_search_history')" @click="emit('clear-history-item', searcHistoryItem.id)">
          <div i-ri:delete-bin-line />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
