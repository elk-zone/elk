<script setup lang="ts">
import type { mastodon } from 'masto'

const {
  status,
  newer,
  withAction = true,
} = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  newer?: mastodon.v1.Status
  withAction?: boolean
}>()

const { translation } = await useTranslation(status, getLanguageCode())

const emojisObject = useEmojisFallback(() => status.emojis)
const vnode = computed(() => {
  if (!status.content)
    return null
  return contentToVNode(status.content, {
    emojis: emojisObject.value,
    mentions: 'mentions' in status ? status.mentions : undefined,
    markdown: true,
    collapseMentionLink: !!('inReplyToId' in status && status.inReplyToId),
    status: 'id' in status ? status : undefined,
    inReplyToStatus: newer,
  })
})
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative>
    <span
      v-if="status.content"
      class="content-rich line-compact" dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" v-if="vnode" />
    </span>
    <div v-else />
    <StatusCard
      v-if="status.quote"
      v-show="status.quote.state === 'accepted'"
      :status="status.quote?.quotedStatus"
      :actions="false"
      :newer="newer"
      border-1 my-3
    />
    <p>Status: {{ status.quote?.state }})</p>
    <!--
      TODO: handle non-accepted quoted post
      pending: never;
      accepted: never;
      rejected: never;
      revoked: never;
      deleted: never;
      unauthorized: never;

      pending: The quote has been created but requires the original author's manual approval before it can be displayed to others.
      accepted: The quote has been approved by the original author and is ready to be displayed.
      rejected: The original author has explicitly rejected the quote, and it will not be displayed.
      revoked: The quote was previously accepted but the original author has since revoked it.
      deleted: The quote was accepted, but the original post has since been deleted.
      unauthorized: The user is not authorized to see the quote (e.g., it was a private post).
      blocked_account: The user has blocked the account that was quoted.
      blocked_domain: The user has blocked the domain of the account that was quoted.
      muted_account: The user has muted the account that was quoted.
    -->
    <hr>
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich v-if="translation.success" class="line-compact" :content="translation.text" :emojis="status.emojis" />
      <div v-else text-red-4>
        Error: {{ translation.error }}
      </div>
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
