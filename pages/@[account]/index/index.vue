<script setup lang="ts">
const params = useRoute().params
const accountName = $(computedEager(() => params.account as string))

const account = await fetchAccountByName(accountName)
const tabNames = ['Posts', 'Posts & replies', 'Media'] as const

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref('Posts')

const paginatorPosts = useMasto().accounts.getStatusesIterable(account.id, { excludeReplies: true })
const paginatorPostsWithReply = useMasto().accounts.getStatusesIterable(account.id, { excludeReplies: false })
const paginatorMedia = useMasto().accounts.getStatusesIterable(account.id, { onlyMedia: true, excludeReplies: false })

const paginator = $computed(() => {
  switch (tab) {
    case 'Posts & replies':
      return paginatorPostsWithReply

    case 'Media':
      return paginatorMedia

    default:
      return paginatorPosts
  }
})
</script>

<template>
  <div>
    <CommonTabs v-model="tab" :options="tabNames" />
    <KeepAlive>
      <TimelinePaginator :key="tab" :paginator="paginator" />
    </KeepAlive>
  </div>
</template>
