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

// Protect against long code snippets
const maxLines = 20

const meta = computed(() => {
  const { description } = props.card
  const meta = description.match(/.*Code Snippet from (.+), lines (\S+)\n\n(.+)/s)
  const file = meta?.[1]
  const lines = meta?.[2]
  const code = meta?.[3].split('\n').slice(0, maxLines).join('\n')
  const project = props.card.title?.replace(' - StackBlitz', '')
  return {
    file,
    lines,
    code,
    project,
  } satisfies Meta
})

const vnodeCode = computed(() => {
  if (!meta.value.code)
    return null
  const code = meta.value.code
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`/g, '&#96;')

  const vnode = contentToVNode(`<p>\`\`\`${meta.value.file?.split('.')?.[1] ?? ''}\n${code}\n\`\`\`\</p>`, {
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
    pb-2
  >
    <div whitespace-pre-wrap break-words>
      <span v-if="vnodeCode" class="content-rich line-compact" dir="auto">
        <component :is="vnodeCode" />
      </span>
    </div>
    <div
      flex
      justify-between
      display-block of-hidden
      bg-card
      w-full
      p-3
      pb-4
    >
      <div flex flex-col>
        <p flex gap-1>
          <span>{{ $t('custom_cards.stackblitz.snippet_from', [meta.file]) }}</span><span text-secondary>{{ `- ${$t('custom_cards.stackblitz.lines', [meta.lines])}` }}</span>
        </p>
        <div flex font-bold gap-2>
          <span text-primary>{{ meta.project }}</span><span flex text-secondary><span flex items-center><svg h-5 width="22.27" height="32" viewBox="0 0 256 368"><path fill="currentColor" d="M109.586 217.013H0L200.34 0l-53.926 150.233H256L55.645 367.246l53.927-150.233z" /></svg></span><span>StackBlitz</span></span>
        </div>
      </div>
      <NuxtLink external target="_blank" btn-solid pt-0 pb-1 px-2 h-fit :to="card.url">
        {{ $t('custom_cards.stackblitz.open') }}
      </NuxtLink>
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
