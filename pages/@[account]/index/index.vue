<script setup lang="ts">
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

const account = await fetchAccountByHandle(handle)
const { t } = useI18n()

const paginatorPosts = useMasto().accounts.getStatusesIterable(account.id, { excludeReplies: true })
const paginatorPostsWithReply = useMasto().accounts.getStatusesIterable(account.id, { excludeReplies: false })
const paginatorMedia = useMasto().accounts.getStatusesIterable(account.id, { onlyMedia: true, excludeReplies: false })

const tabs = $computed(() => [
  {
    name: 'posts',
    display: t('tab.posts'),
    icon: 'i-ri:file-list-2-line',
    paginator: paginatorPosts,
  },
  {
    name: 'relies',
    display: t('tab.posts_with_replies'),
    icon: 'i-ri:chat-3-line',
    paginator: paginatorPostsWithReply,
  },
  {
    name: 'media',
    display: t('tab.media'),
    icon: 'i-ri:camera-2-line',
    paginator: paginatorMedia,
  },
] as const)

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref(tabs[0].name)
const paginator = $computed(() => tabs.find(t => t.name === tab)!.paginator)
</script>

<template>
  <div>
    <CommonTabs v-model="tab" :options="tabs" command />
    <KeepAlive>
      <TimelinePaginator :key="tab" :paginator="paginator" />
    </KeepAlive>
  </div>
</template>
