<script setup lang="ts">
import { useImageGesture } from '~/composables/gestures'

const emit = defineEmits(['close'])

const img = ref()

const current = computed(() => mediaPreviewList.value[mediaPreviewIndex.value])
const hasNext = computed(() => mediaPreviewIndex.value < mediaPreviewList.value.length - 1)
const hasPrev = computed(() => mediaPreviewIndex.value > 0)

useImageGesture(img, {
  hasNext,
  hasPrev,
  onNext() {
    if (hasNext.value)
      mediaPreviewIndex.value++
  },
  onPrev() {
    if (hasPrev.value)
      mediaPreviewIndex.value--
  },
})

// stop global zooming
useEventListener('wheel', (evt) => {
  if (evt.ctrlKey && (evt.deltaY < 0 || evt.deltaY > 0))
    evt.preventDefault()
}, { passive: false })

const keys = useMagicKeys()

whenever(keys.arrowLeft, prev)
whenever(keys.arrowRight, next)

function next() {
  if (hasNext.value)
    mediaPreviewIndex.value++
}

function prev() {
  if (hasPrev.value)
    mediaPreviewIndex.value--
}

function onClick(e: MouseEvent) {
  const path = e.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO', 'P'].includes(el.tagName?.toUpperCase()))
  if (!el)
    emit('close')
}
</script>

<template>
  <div relative h-full w-full flex pt-12 @click="onClick">
    <button
      v-if="hasNext" pointer-events-auto btn-action-icon bg="black/20" :aria-label="$t('action.previous')"
      hover:bg="black/40" dark:bg="white/30" dark:hover:bg="white/20" absolute top="1/2" right-1
      :title="$t('action.next')" @click="next"
    >
      <div i-ri:arrow-right-s-line text-white />
    </button>
    <button
      v-if="hasPrev" pointer-events-auto btn-action-icon bg="black/20" aria-label="action.next"
      hover:bg="black/40" dark:bg="white/30" dark:hover:bg="white/20" absolute top="1/2" left-1
      :title="$t('action.prev')" @click="prev"
    >
      <div i-ri:arrow-left-s-line text-white />
    </button>
    <img
      ref="img"
      :src="current.url || current.previewUrl"
      :alt="current.description || ''"
      max-h-full max-w-full ma
    >

    <div absolute top-0 w-full flex justify-between>
      <button
        btn-action-icon bg="black/30" aria-label="action.close" hover:bg="black/40" dark:bg="white/30"
        dark:hover:bg="white/20" pointer-events-auto shrink-0 @click="emit('close')"
      >
        <div i-ri:close-line text-white />
      </button>
      <div bg="black/30" dark:bg="white/10" ms-4 my-auto text-white rounded-full flex="~ center" overflow-hidden>
        <div v-if="mediaPreviewList.length > 1" p="y-1 x-2" rounded-r-0 shrink-0>
          {{ mediaPreviewIndex + 1 }} / {{ mediaPreviewList.length }}
        </div>
        <p
          v-if="current.description" bg="dark/30" dark:bg="white/10" p="y-1 x-2" rounded-ie-full line-clamp-1
          ws-pre-wrap break-all :title="current.description" w-full
        >
          {{ current.description }}
        </p>
      </div>
    </div>
  </div>
</template>
