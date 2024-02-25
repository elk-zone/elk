<script lang="ts" setup xmlns:hover="http://www.w3.org/1999/xhtml">
import type { mastodon } from 'masto'

const props = defineProps<{
  tag?: mastodon.v1.Tag
  tagName?: string
  layout: 'card' | 'hovercard'
}>()

let tag: mastodon.v1.Tag
if (props.tag)
  tag = props.tag
else if (props.tagName)
  tag = await fetchTag(props.tagName)
else
  console.error('TagCard: tag or tagName is required')

const to = computed(() => {
  const { hostname, pathname } = new URL(tag.url)
  return `/${hostname}${pathname}`
})

const router = useRouter()

function onclick(evt: MouseEvent | KeyboardEvent) {
  const path = evt.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON'].includes(el.tagName?.toUpperCase()))
  const text = window.getSelection()?.toString()
  if (!el && !text)
    go(evt)
}

function go(evt: MouseEvent | KeyboardEvent) {
  if (evt.metaKey || evt.ctrlKey)
    window.open(to.value)
  else
    router.push(to.value)
}
</script>

<template>
  <div
    block p4 hover:bg-active flex justify-between cursor-pointer flex-gap-2
    @click="onclick"
    @keydown.enter="onclick"
  >
    <div>
      <h4 flex items-center text-size-base leading-normal font-medium line-clamp-1 break-all ws-pre-wrap>
        <TagActionButton v-show="props.layout === 'card'" :tag="tag" />
        <bdi>
          <span>#</span>
          <span hover:underline>{{ tag.name }}</span>
        </bdi>
      </h4>
      <CommonTrending v-if="tag.history" :history="tag.history" text-sm text-secondary line-clamp-1 ws-pre-wrap break-all />
    </div>
    <div v-if="tag.history" flex items-center>
      <CommonTrendingCharts :history="tag.history" />
      <TagActionButton v-show="props.layout === 'hovercard'" :tag="tag" />
    </div>
  </div>
</template>
