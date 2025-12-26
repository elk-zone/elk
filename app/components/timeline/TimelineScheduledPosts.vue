<script setup lang="ts">
import type { mastodon } from 'masto'

const paginator = useMastoClient().v1.scheduledStatuses.list()

function preprocess(items: (mastodon.v1.ScheduledStatus | mastodon.v1.Status)[]): mastodon.v1.Status[] {
  const scheduledStatuses = items.filter(item => 'scheduledAt' in item) as mastodon.v1.ScheduledStatus[]
  return scheduledStatuses.map((scheduledStatus) => {
    return ({
      ...scheduledStatus.params,
      id: scheduledStatus.id,
      uri: '',
      url: '',
      content: scheduledStatus.params.text || '',
      account: currentUser.value!.account,
      createdAt: scheduledStatus.scheduledAt,
      editedAt: scheduledStatus.scheduledAt,
      reblog: null,
      reblogged: false,
      reblogsCount: 0,
      favouritesCount: 0,
      repliesCount: 0,
      emojis: [],
      tags: [],
      mentions: [],
      attachments: scheduledStatus.mediaAttachments || [],
      card: null,
      poll: null,
      pinned: false,
      bookmarked: false,
      favourited: false,
      filtered: [],
      sensitive: scheduledStatus.params.sensitive || false,
      spoilerText: scheduledStatus.params.spoilerText || '',
      visibility: scheduledStatus.params.visibility || 'public',
      inReplyToId: scheduledStatus.params.inReplyToId || null,
      inReplyToAccountId: null,
      muted: false,
      mediaAttachments: scheduledStatus.mediaAttachments || [],
      application: { name: '' },
      quotesCount: 0,
      quoteApproval: {
        automatic: [],
        manual: [],
        currentUser: 'unknown',
      },
    })
  })
}
</script>

<template>
  <TimelineScheduledPostsPaginator end-message="common.no_scheduled_posts" :paginator="paginator" :preprocess="preprocess" />
</template>
