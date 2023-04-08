<script lang="ts" setup>
import type { mastodon } from 'masto'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const client = useMastoClient()

const paginator = client.v1.lists.list()

useHead({
  title: () => t('nav.lists'),
})

const paginatorRef = ref()

async function createList(title: string) {
  const newEntry = await client.v1.lists.create({
    title,
  })
  paginatorRef.value?.createEntry(newEntry)
}

function updateEntry(list: mastodon.v1.List) {
  paginatorRef.value?.updateEntry(list)
}
function removeEntry(id: string) {
  paginatorRef.value?.removeEntry(id)
}
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/lists" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:list-check />
        <span text-lg font-bold>{{ t('nav.lists') }}</span>
      </NuxtLink>
    </template>
    <slot>
      <CommonPaginator ref="paginatorRef" :paginator="paginator">
        <template #default="{ item }">
          <ListEntry
            :list="item"
            @update:list="updateEntry"
            @list-removed="removeEntry"
          />
        </template>
        <template #done>
          <div px-4>
            <CommonListCreate
              id="list"
              border="t base"
              create-button-icon="i-material-symbols:playlist-add-rounded"
              placeholder="List title"
              :create-callback="createList"
            >
              <template #error-text>
                {{ $t('list.error') }}
              </template>
            </CommonListCreate>
          </div>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
