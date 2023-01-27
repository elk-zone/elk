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
      <div p4 hover:bg-active block w="100%" flex justify-between items-center gap-4>
        <p>{{ item.title }}</p>
        <CommonTooltip
          :content="indexOfUserInList(item.id) === -1 ? $t('list.add_account') : $t('list.remove_account')"
          :hover="indexOfUserInList(item.id) === -1 ? 'text-green' : 'text-red'"
        >
          <button
            :class="indexOfUserInList(item.id) === -1 ? 'i-ri:user-add-line' : 'i-ri:user-unfollow-line'"
            text-xl @click="() => edit(item.id)"
          />
        </CommonTooltip>
      </div>
    </template>
  </CommonPaginator>
</template>
