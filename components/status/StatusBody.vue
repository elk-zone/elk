<script setup lang="ts">
import type { Status, StatusEdit } from 'masto'

const {
  status,
  withAction = true,
} = defineProps<{
  status: Status | StatusEdit
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
