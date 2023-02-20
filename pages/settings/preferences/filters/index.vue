<script setup lang="ts">
import type { mastodon } from 'masto'
const { t } = useI18n()

definePageMeta({
  middleware: 'auth',
})

useHeadFixed({
  title: () => t('settings.preferences.filters.title'),
})

const client = useMastoClient()
const filterPaginator = client.v2.filters.list()
const paginatorRef = ref()

async function createFilter(title: string) {
  const newEntry = await client.v2.filters.create({
    title,
    context: ['home', 'public', 'thread'],
  })
  paginatorRef.value?.createEntry(newEntry)
}

function updateEntry(list: mastodon.v2.Filter) {
  paginatorRef.value?.updateEntry(list)
}
function removeEntry(id: string) {
  paginatorRef.value?.removeEntry(id)
}
</script>

<template>
  <MainContent back-on-small-screen>
    <CommonPaginator ref="paginatorRef" :paginator="filterPaginator">
      <template #default="{ item }">
        <SettingsFilter
          :filter="item"
          :paginator="filterPaginator"
          @filter-removed="removeEntry"
        />
      </template>
      <template #done>
        <CommonListCreate
          id="filter"
          create-button-icon="i-ri-filter-line"
          :placeholder="$t('settings.preferences.filters.filter_title')"
          :create-callback="createFilter"
        >
          <template #error-text>
            {{ $t('settings.preferences.filters.errors.create') }}
          </template>
        </CommonListCreate>
      </template>
    </CommonPaginator>
  </MainContent>
</template>
