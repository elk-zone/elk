<script lang="ts" setup>
const { userId } = defineProps<{
  userId: string
}>()

const { client } = $(useMasto())
const paginator = client.v1.lists.list()
const listsWithUser = ref((await client.v1.accounts.listLists(userId)).map(list => list.id))
// TODO: set showCreate to false when popover is hidden, tried but not elegant at current stage
const showCreate = ref(false)

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
  <CommonPaginator :end-message="false" :paginator="paginator">
    <template #default="{ item }">
      <div p4 hover:bg-active block w="100%" flex justify-between items-center gap-4>
        <p>{{ item.title }}</p>
        <CommonTooltip
          :content="indexOfUserInList(item.id) === -1 ? $t('list.add_account') : $t('list.remove_account')"
          :hover="indexOfUserInList(item.id) === -1 ? 'text-green' : 'text-red'"
        >
          <button
            text-sm p2 border-1 transition-colors
            border-dark
            btn-action-icon
            @click="() => edit(item.id)"
          >
            <button
              text-sm p2 border-1 transition-colors
              border-dark
              btn-action-icon
              @click="() => edit(item.id)"
            >
              <span :class="indexOfUserInList(item.id) === -1 ? 'i-ri:user-add-line' : 'i-ri:user-unfollow-line'" />
            </button>
          </CommonTooltip>
        </div>
      </template>
    </CommonPaginator>
    <ListCreate
      v-if="showCreate" @list-created="() => {}"
    />
    <button
      v-else text-sm p4
      transition-colors border-dark flex-center flex gap-2
      hover:bg-active @click="showCreate = true"
    >
      <span block i-carbon:add />
      {{ $t('list.create_new_list') }}
    </button>
  </div>
</template>
