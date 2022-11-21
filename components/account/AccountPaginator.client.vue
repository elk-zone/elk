<script setup lang="ts">
import type { Account, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Account[]>
}>()

const masto = await useMasto()

const metadataMap = $ref<{ [key: string]: { following?: boolean } }>({})
async function onNewItems(items: Account[]) {
  for (const item of items)
    metadataMap[item.id] = { following: undefined }

  const relationships = await masto.accounts.fetchRelationships(items.map(item => item.id))
  for (const rel of relationships)
    metadataMap[rel.id].following = rel.following
}
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
    border="t border"
    @items="onNewItems"
  >
    <template #default="{ item }">
      <AccountCard
        :account="item"
        :following="metadataMap[item.id]?.following"
        border="b border" py-1
      />
    </template>
  </CommonPaginator>
</template>
