<script lang="ts" setup>
import type { mastodon } from 'masto'

const {
  tag,
} = defineProps<{
  tag: mastodon.v1.Tag
}>()

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
    block p4 hover:bg-active flex justify-between cursor-pointer
    @click="onclick"
    @keydown.enter="onclick"
  >
    <div>
      <h4 flex items-center text-size-base leading-normal font-medium line-clamp-1 break-all ws-pre-wrap>
        <TagActionButton :tag="tag" />
        <bdi>
          <span>#</span>
          <span hover:underline>{{ tag.name }}</span>
        </bdi>
      </h4>
      <CommonTrending v-if="tag.history" :history="tag.history" text-sm text-secondary line-clamp-1 ws-pre-wrap break-all />
    </div>
    <div v-if="tag.history" flex items-center>
      <CommonTrendingCharts :history="tag.history" />
    </div>
  </div>
</template>
