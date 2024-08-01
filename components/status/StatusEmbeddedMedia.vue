<script setup lang="ts">
import type { mastodon } from 'masto'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const vnode = computed(() => {
  if (!status.card?.html)
    return null
  const node = sanitizeEmbeddedIframe(status.card?.html)?.children[0]
  return node ? nodeToVNode(node) : null
})
const overlayToggle = ref(true)
const card = ref(status.card)
</script>

<template>
  <div v-if="card">
    <div
      v-if="overlayToggle"
      h-80
      cursor-pointer
      relative
    >
      <div
        p-3
        absolute
        w-full
        h-full
        z-10
        rounded-lg
        style="background: linear-gradient(black, rgba(0,0,0,0.5), transparent, transparent, rgba(0,0,0,0.20))"
      >
        <NuxtLink flex flex-col gap-1 hover:underline text-xs text-light font-light target="_blank" :href="card?.url">
          <div flex gap-0.5>
            <p flex-row line-clamp-1>
              {{ card?.providerName }}<span v-if="card?.authorName"> • {{ card?.authorName }}</span>
            </p>
            <span
              flex-row
              w-4 h-4
              pointer-events-none
              i-ri:arrow-right-up-line
            />
          </div>
          <p font-bold line-clamp-1 text-size-base>
            {{ card?.title }}
          </p>
          <p line-clamp-1>
            {{ $t('status.embedded_warning') }}
          </p>
        </NuxtLink>
        <div
          flex
          h-50
          mt-1
          justify-center
          flex-items-center
        >
          <button
            absolute
            bg-primary
            opacity-85
            rounded-full
            hover:bg-primary-active
            hover:opacity-95
            transition-all
            box-shadow-outline
            @click.stop.prevent="() => overlayToggle = !overlayToggle"
          >
            <span
              text-light
              flex flex-col
              gap-3
              w-27 h-27
              pointer-events-none
              i-ri:play-circle-line
            />
          </button>
        </div>
      </div>
      <CommonBlurhash
        v-if="card?.image"
        :blurhash="card.blurhash"
        :src="card.image"
        w-full
        h-full
        object-cover
        rounded-lg
      />
    </div>
    <div v-else>
      <!-- this inserts the iframe -->
      <component :is="vnode" v-if="vnode" rounded-lg h-80 />
    </div>
  </div>
</template>

<style>
iframe {
    width: 100%;
    height: 100%;
}
</style>
