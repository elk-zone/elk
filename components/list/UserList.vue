<script setup lang="ts">
const { listId } = defineProps<{
  listId: string
}>()

const paginator = useMastoClient().v1.lists.listAccounts(listId)
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <AccountCard
        :account="item"
        hover-card
        border="b base" py2 px4
      />
    </template>
  </CommonPaginator>
</template>
