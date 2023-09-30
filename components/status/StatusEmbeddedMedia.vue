<script setup lang="ts">
import type { mastodon } from 'masto'
import { h } from 'vue'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const vnode = $computed(() => {
  if (!status.card?.html)
    return null
  const node = sanitizeEmbeddedIframe(status.card?.html)?.children[0]
  return node ? nodeToVNode(node) : null
})
</script>

<template>
  <component :is="vnode" v-if="vnode" h-70 />
</template>

<style>
iframe {
    width: 100%;
    height: 100%;
}
</style>
