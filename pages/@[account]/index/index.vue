<script setup lang="ts">
import type { Account } from 'masto'

const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-index' })

const { data: account } = await useAsyncData(`account:${handle}`, async () => (
  window.history.state?.account as Account | undefined)
  ?? await fetchAccountByHandle(handle),
)
const { t } = useI18n()

const paginatorPosts = useMasto().accounts.getStatusesIterable(account.value!.id, { excludeReplies: true })
const paginatorPostsWithReply = useMasto().accounts.getStatusesIterable(account.value!.id, { excludeReplies: false })
const paginatorMedia = useMasto().accounts.getStatusesIterable(account.value!.id, { onlyMedia: true, excludeReplies: false })

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
  <div v-if="(account!.discoverable === false)" h-30 flex="~ center" text-secondary-light>
    Profile unavailable
  </div>
  <div v-else>
    <CommonTabs v-model="tab" :options="tabs" command />
    <KeepAlive>
      <TimelinePaginator :key="tab" :paginator="paginator" />
    </KeepAlive>
  </div>
</template>
