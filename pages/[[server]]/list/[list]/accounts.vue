<script setup lang="ts">
definePageMeta({
  name: 'list-accounts',
})

const params = useRoute().params
const listId = $(computedEager(() => params.list as string))

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
