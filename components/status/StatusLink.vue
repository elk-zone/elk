<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  status: mastodon.v1.Status
  hover?: boolean
}>()

const el = ref<HTMLElement>()
const router = useRouter()
const statusRoute = computed(() => getStatusRoute(props.status))

function onclick(evt: MouseEvent | KeyboardEvent) {
  const path = evt.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  const text = window.getSelection()?.toString()
  const isCustomEmoji = el?.parentElement?.classList.contains('custom-emoji')
  if ((!el && !text) || isCustomEmoji)
    go(evt)
}

function go(evt: MouseEvent | KeyboardEvent) {
  if (evt.metaKey || evt.ctrlKey) {
    window.open(statusRoute.value.href)
  }
  else {
    cacheStatus(props.status)
    router.push(statusRoute.value)
  }
}
</script>

<template>
  <div
    :id="`status-${status.id}`"
    ref="el"
    relative flex="~ col gap1"
    p="b-2 is-3 ie-4"
    :class="{ 'hover:bg-active': hover }"
    tabindex="0"
    focus:outline-none focus-visible:ring="2 primary inset"
    aria-roledescription="status-card"
    :lang="status.language ?? undefined"
    @click="onclick"
    @keydown.enter="onclick"
  >
    <slot />
  </div>
</template>
