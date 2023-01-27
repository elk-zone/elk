<script lang="ts" setup>
const { userId } = defineProps<{
  userId: string
}>()

const { client } = $(useMasto())
const paginator = client.v1.lists.list()
const listsWithUser = client.v1.accounts.listLists(userId)
</script>

<template>
  <CommonPaginator no-end-message :paginator="paginator">
    <template #default="{ item }">
      <div :to="`list/${item.id}`" block p4 hover:bg-active flex justify-between items-center>
        <span>{{ item.title }}</span>
      </div>
    </template>
  </CommonPaginator>
</template>
