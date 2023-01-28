<script setup lang="ts">
import type { mastodon } from 'masto'

const {
  status,
  newer,
  withAction = true,
  cleanSharedLink,
} = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  newer?: mastodon.v1.Status
  withAction?: boolean
  cleanSharedLink?: string | false
}>()

const { translation } = useTranslation(status, getLanguageCode())

const emojisObject = useEmojisFallback(() => status.emojis)

/**
 * example status raw content
 *
 * <p>🔴 trying to code live - come let&#39;s talk <span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention">@<span>elk</span></a></span> and <a href="https://social.ayco.io/tags/opensource" class="mention hashtag" rel="tag">#<span>opensource</span></a> <a href="https://www.twitch.tv/ayoayco" target="_blank" rel="nofollow noopener noreferrer"><span class="invisible">https://www.</span><span class="">twitch.tv/ayoayco</span><span class="invisible"></span></a></p>
 *
 *
 * "<p>I say something about the link first</p><p><a href=\"https://ayco.io\" target=\"_blank\" rel=\"nofollow noopener noreferrer\"><span class=\"invisible\">https://</span><span class=\"\">ayco.io</span><span class=\"invisible\"></span></a></p>"

 *
 */

const vnode = $computed(() => {
  if (!status.content)
    return null
  const vnode = contentToVNode(status.content, {
    emojis: emojisObject.value,
    mentions: 'mentions' in status ? status.mentions : undefined,
    markdown: true,
    collapseMentionLink: !!('inReplyToId' in status && status.inReplyToId),
    status: 'id' in status ? status : undefined,
    inReplyToStatus: newer,
    cleanSharedLink,
  })

  return vnode
})
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative>
    <span
      v-if="status.content"
      class="content-rich line-compact" dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" />
    </span>
    <div v-else />
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
