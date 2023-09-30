<script setup lang="ts">
import type { mastodon } from 'masto'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const vnode = $computed(() => {
  if (!status.card?.html)
    return null
  const node = sanitizeEmbeddedIframe(status.card?.html)?.children[0]
  return node ? nodeToVNode(node) : null
})
const toggle = ref(true)
const card = ref(status.card)
</script>

<template>
  <div v-if="toggle">
    <div
      w-full h-full
    >
      <div
        rounded-full
        absolute
        bg-primary
        opacity-80
        cursor-pointer
        @click="() => toggle = !toggle"
      >
        <span
          text-center
          justify-center
          items-center
          text-white
          hover:text-primary
          flex flex-col
          gap-3 h-30 w-30
          pointer-events-none
          i-ri:play-circle-line
        />
      </div>

      <CommonBlurhash
        v-if="card?.image"
        :blurhash="card.blurhash"
        :src="card.image"
        w-full
        max-h-70 object-cover rounded-lg
      />
    </div>
  </div>
  <div v-else>
    <component :is="vnode" v-if="vnode" rounded-lg h-70 />
  </div>
</template>

<style>
iframe {
    width: 100%;
    height: 100%;
}
</style>
