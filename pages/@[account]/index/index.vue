<script setup lang="ts">
const params = useRoute().params
const accountName = $(computedEager(() => params.account as string))

const account = await fetchAccountByName(accountName)
const { t } = useI18n()

const paginatorPosts = useMasto().accounts.getStatusesIterable(account.id, { excludeReplies: true })
const paginatorPostsWithReply = useMasto().accounts.getStatusesIterable(account.id, { excludeReplies: false })
const paginatorMedia = useMasto().accounts.getStatusesIterable(account.id, { onlyMedia: true, excludeReplies: false })

const tabs = $computed(() => [
  {
    name: 'posts',
    display: t('tab.posts'),
    paginator: paginatorPosts,
  },
  {
    name: 'relies',
    display: t('tab.posts_with_replies'),
    paginator: paginatorPostsWithReply,
  },
  {
    name: 'media',
    display: t('tab.media'),
    paginator: paginatorMedia,
  },
] as const)

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref(tabs[0].name)
const paginator = $computed(() => tabs.find(t => t.name === tab)!.paginator)
</script>

<template>
  <div>
    <CommonTabs v-model="tab" :options="tabs" />
    <KeepAlive>
      <TimelinePaginator :key="tab" :paginator="paginator" />
    </KeepAlive>
  </div>
</template>
