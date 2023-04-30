<script lang="ts" setup>
import type { mastodon } from 'masto'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const client = useMastoClient()

const paginator = client.v1.lists.list()

useHydratedHead({
  title: () => t('nav.lists'),
})

const paginatorRef = ref()

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
          <ListCreate
            @list-created="(newEntry) => {
              paginatorRef?.createEntry(newEntry)
            }"
          />
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
