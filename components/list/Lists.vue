<script lang="ts" setup>
const { userId } = defineProps<{
  userId: string
}>()

const { client } = $(useMasto())
const paginator = client.v1.lists.list()
const listsWithUser = ref((await client.v1.accounts.listLists(userId)).map(list => list.id))

function indexOfUserInList(listId: string) {
  return listsWithUser.value.indexOf(listId)
}

async function edit(listId: string) {
  try {
    const index = indexOfUserInList(listId)
    if (index === -1) {
      await client.v1.lists.addAccount(listId, { accountIds: [userId] })
      listsWithUser.value.push(listId)
    }
    else {
      await client.v1.lists.removeAccount(listId, { accountIds: [userId] })
      listsWithUser.value = listsWithUser.value.filter(id => id !== listId)
    }
  }
  catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <CommonPaginator no-end-message :paginator="paginator">
    <template #default="{ item }">
      <button
        p4 hover:bg-active block w="100%"
        :class="indexOfUserInList(item.id) === -1 ? 'text-green' : 'text-red'"
        :aria-label="indexOfUserInList(item.id) === -1 ? $t('list.add_account') : $t('list.remove_account')"
        @click="() => edit(item.id)"
      >
        {{ item.title }}
      </button>
    </template>
  </CommonPaginator>
</template>
