<script setup lang="ts">
const params = useRoute().params
const accountName = $computed(() => params.account as string)

const account = await fetchAccountByName(accountName)
const tabNames = ['Posts', 'Posts and replies'] as const

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref('Posts')

const paginatorPosts = masto.accounts.getStatusesIterable(account.id, { excludeReplies: true })
const paginatorPostsWithReply = masto.accounts.getStatusesIterable(account.id, { excludeReplies: false })

const paginator = $computed(() => {
  return tab === 'Posts' ? paginatorPosts : paginatorPostsWithReply
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
