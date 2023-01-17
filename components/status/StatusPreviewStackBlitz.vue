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
  project?: string
}

const meta = $computed(() => {
  const { description } = props.card
  const meta = description.match(/.+\n\nCode Snippet from (.+), lines ([\w-]+)\n\n(.+)/s)
  const file = meta?.[1]
  const lines = meta?.[2].replaceAll('N', '')
  const code = meta?.[3]
  const project = props.card.title?.replace(' - StackBlitz', '')
  const info = $ref<Meta>({
    file,
    lines,
    code,
    project,
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
    flex flex-col gap-1
    display-block of-hidden
    w-full
    rounded-lg
    overflow-hidden
  >
    <div whitespace-pre-wrap break-words>
      <span v-if="vnodeCode" class="content-rich line-compact" dir="auto">
        <component :is="vnodeCode" />
      </span>
    </div>
    <div
      flex flex-col
      display-block of-hidden
      bg-card
      w-full
      justify-center
      rounded="bl-lg br-lg"
      p-3
      pb-4
    >
      <div flex justify-between>
        <p flex gap-1>
          <span>Code Snippet from</span><span>{{ meta.file }}</span><span text-secondary>{{ `- Lines ${meta.lines}` }}</span>
        </p>
        <NuxtLink external target="_blank" btn-solid py-0 px-2 :to="card.url">
          Open
        </NuxtLink>
      </div>
      <div flex justify-between>
        <p font-bold flex gap-1>
          <span text-primary>{{ meta.project }}</span><span> - StackBlitz</span>
        </p>
      </div>
    </div>
  </div>
  <StatusPreviewCardNormal v-else :card="card" :small-picture-only="smallPictureOnly" :root="root" />
</template>

<style scoped>
.content-rich p {
  margin-top: 0;
}
.code-block {
  margin-top: 0;
  border-radius: 0;
}
</style>
