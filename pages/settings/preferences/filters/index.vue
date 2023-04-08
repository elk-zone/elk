<script setup lang="ts">
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

function removeEntry(id: string) {
  paginatorRef.value?.removeEntry(id)
}
</script>

<template>
  <MainContent back-on-small-screen>
    <h2 px6 pt4 my-2 font-bold text-xl flex items-center>
      {{ $t('settings.preferences.filters.title') }}
    </h2>

    <p px6 text-secondary mb-4>
      {{ $t("settings.preferences.filters.description_page") }}
    </p>

    <CommonPaginator ref="paginatorRef" :paginator="filterPaginator" px-6 flex="~ col gap-3">
      <template #default="{ item }">
        <SettingsFilter
          :filter="item"
          :paginator="filterPaginator"
          @filter-removed="removeEntry"
        />
      </template>
      <template #done>
        <div mt-3>
          <h3 text-md font-bold>
            {{ $t('settings.preferences.filters.create_title') }}
          </h3>
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
        </div>
      </template>
    </CommonPaginator>
  </MainContent>
</template>
