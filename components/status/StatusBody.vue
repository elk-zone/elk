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

const idealHeight = window.screen.height * 0.51
const root = ref<HTMLElement | null>(null)
const { height } = useElementSize(root)
const doCollapseLongStatus = ref(false)

onMounted(() => doCollapseLongStatus.value = height.value > idealHeight)

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
  <div
    ref="root" class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative
    max-h-50vh text-overflow-ellipsis overflow-hidden
  >
    <span
      v-if="status.content"
      class="content-rich line-compact" dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" v-if="vnode" />
    </span>
    <div v-else />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich v-if="translation.success" class="line-compact" :content="translation.text" :emojis="status.emojis" />
      <div v-else text-red-4>
        Error: {{ translation.error }}
      </div>
    </template>

    <button v-if="doCollapseLongStatus" btn-solid rounded-3 hover:bg-active cursor-pointer href="#">
      Read more
    </button>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
