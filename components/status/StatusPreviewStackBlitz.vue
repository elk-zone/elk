<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  card: mastodon.v1.PreviewCard
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()

interface Meta {
  code?: string
  file?: string
  lines?: string
}

const meta = $computed(() => {
  const { description } = props.card
  const meta = description.match(/.+\n\nCode Snippet from (.+), lines ([\w-]+)\n\n(.+)/s)
  const file = meta?.[1]
  const lines = meta?.[2]
  const code = meta?.[3]
  const info = $ref<Meta>({
    file,
    lines,
    code,
  })
  return info
})

const vnodeCode = $computed(() => {
  if (!meta.code)
    return null
  const vnode = contentToVNode(`<p>\`\`\`${meta.file?.split('.')?.[1] ?? ''}\n${meta.code}\n\`\`\`\</p>`, {
    markdown: true,
  })
  return vnode
})
</script>

<template>
  <div
    v-if="meta.code"
    flex flex-col
    display-block of-hidden
    w-full
    justify-center
  >
    <div
      flex flex-col
      display-block of-hidden
      bg-card
      w-full
      justify-center
      rounded-lg
      p-3
    >
      <div flex justify-between>
        <p font-bold>
          {{ card.title }}
        </p>
        <NuxtLink external target="_blank" btn-solid py-0 px-2 :to="card.url">
          Open
        </NuxtLink>
      </div>

      <div flex justify-between>
        <p flex gap-1>
          <span>Code Snippet from</span><span>{{ meta.file }}</span><span text-secondary>{{ `(Lines ${meta.lines})` }}</span>
        </p>
      </div>
    </div>
    <div whitespace-pre-wrap break-words rounded-lg>
      <span v-if="vnodeCode" class="content-rich line-compact" dir="auto">
        <component :is="vnodeCode" />
      </span>
    </div>
  </div>
  <StatusPreviewCardNormal v-else :card="card" :small-picture-only="smallPictureOnly" :root="root" />
</template>
