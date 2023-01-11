<script setup lang="ts">
import type { mastodon } from 'masto'

const {
  status,
  withAction = true,
} = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  withAction?: boolean
}>()

const { translation } = useTranslation(status)

const emojisObject = useEmojisFallback(() => status.emojis)
const vnode = $computed(() => {
  if (!status.content)
    return null
  const vnode = contentToVNode(status.content, {
    emojis: emojisObject.value,
    markdown: true,
  })
  return vnode
})

// remove link at the end of content if matches preview card URL
const previewCardURL = (status as mastodon.v1.Status).card?.url
if (vnode?.children !== null) {
  const contentChildren = vnode?.children[0].children
  const contentLastChild = contentChildren[contentChildren.length - 1]
  const matchesPreviewURL = contentLastChild.type === 'a' && contentLastChild.props?.href === previewCardURL
  if (matchesPreviewURL)
    contentChildren.pop()
}
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }">
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
      <ContentRich class="line-compact" :content="translation.text" :emojis="status.emojis" />
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
