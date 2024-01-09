<script setup lang="ts">
definePageMeta({
  name: 'list-accounts',
})

const params = useRoute().params
const listId = $(computedEager(() => params.list as string))

const paginator = useMastoClient().v1.lists.$select(listId).accounts.list()
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <ListAccount
        :account="item"
        :list="listId"
        hover-card
        border="b base" py2 px4
      />
    </template>
  </CommonPaginator>
</template>
