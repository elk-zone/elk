<script setup lang="ts">
import type { mastodon } from 'masto'

const { item } = defineProps<{
  item: mastodon.v1.ScheduledStatus
}>()

defineEmits<{ (e: 'deleted'): void }>()

const scheduledAt = useFormattedDateTime(item.scheduledAt)
const timeAgoOptions = useTimeAgoOptions(true)
const timeago = useTimeAgo(() => item.scheduledAt, timeAgoOptions)

// mastodon.v1.ScheduledStatus does not have account information so we use the current login user
const account = currentUser.value!.account

async function handleDelete() {
  const confirmDelete = await openConfirmDialog({
    title: $t('confirm.delete_posts.title'),
    description: $t('confirm.delete_posts.description'),
    confirm: $t('confirm.delete_posts.confirm'),
    cancel: $t('confirm.delete_posts.cancel'),
  })
  if (confirmDelete.choice !== 'confirm')
    return

  try {
    await useMastoClient().v1.scheduledStatuses.$select(item.id).remove()
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <article relative flex gap-3 p-4 border-b border-base>
    <div>
      <AccountHoverWrapper :account="account">
        <AccountBigAvatar :account="account" />
      </AccountHoverWrapper>
    </div>

    <div flex="~ col 1" min-w-0>
      <div flex items-center space-x-1>
        <AccountHoverWrapper :account="account">
          <StatusAccountDetails :account="account" />
        </AccountHoverWrapper>
        <div flex-auto />
        <div text-sm text-secondary flex="~ row nowrap" whitespace-nowrap>
          <CommonTooltip :content="scheduledAt">
            <time :datetime="item.scheduledAt" :title="item.scheduledAt">
              {{ timeago }}
            </time>
          </CommonTooltip>
        </div>
        <button
          p-1
          rounded-full
          text-secondary
          hover:text-red
          :title="$t('menu.delete')"
          @click="handleDelete"
        >
          <div i-ri:delete-bin-line w-5 h-5 />
        </button>
      </div>

      <div v-if="item.params.text" mt2>
        <p v-html="item.params.text" />
      </div>

      <div v-if="item.mediaAttachments?.length" mt2 flex flex-wrap gap-2>
        <img
          v-for="media in item.mediaAttachments"
          :key="media.id"
          :src="(media.previewUrl || media.url) ?? undefined"
          max-w-xs
          rounded
          :alt="media.description ?? undefined"
        >
      </div>
    </div>
  </article>
</template>
