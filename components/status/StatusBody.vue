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

const { translation } = useTranslation(status, getLanguageCode())

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

const userSettings = useUserSettings()
const lineHeight = userSettings.value.lineHeight
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative>
    <span
      v-if="status.content"
      class="content-rich" :class="[`line-height-${lineHeight}`]"
      dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" v-if="vnode" />
    </span>
    <div v-else />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich v-if="translation.success" class="content-rich" :class="[`line-height-${lineHeight}`]" :content="translation.text" :emojis="status.emojis" />
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
