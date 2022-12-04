<script setup lang="ts">
const emit = defineEmits(['close'])

const current = computed(() => mediaPreviewList.value[mediaPreviewIndex.value])
const hasNext = computed(() => mediaPreviewIndex.value < mediaPreviewList.value.length - 1)
const hasPrev = computed(() => mediaPreviewIndex.value > 0)

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
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  if (!el)
    emit('close')
}
</script>

<template>
  <div relative h-full w-full flex select-none pointer-events-none>
    <div absolute top-0 left-0 right-0 text-white text-center>
      {{ mediaPreviewIndex + 1 }} / {{ mediaPreviewList.length }}
    </div>
    <button
      v-if="hasNext"
      pointer-events-auto
      btn-action-icon bg="black/20" aria-label="Close"
      hover:bg="black/40" dark:bg="white/30" dark:hover:bg="white/20"
      absolute top="1/2" right-1
      :title="$t('action.next')"
      @click="next"
    >
      <div i-ri:arrow-right-s-line text-white />
    </button>
    <button
      v-if="hasPrev"
      pointer-events-auto
      btn-action-icon bg="black/20" aria-label="Close"
      hover:bg="black/40" dark:bg="white/30" dark:hover:bg="white/20"
      absolute top="1/2" left-1
      :title="$t('action.prev')"
      @click="prev"
    >
      <div i-ri:arrow-left-s-line text-white />
    </button>
    <img :src="current.url || current.previewUrl" :alt="current.description || ''" max-h="95%" max-w="95%" ma>

    <button
      btn-action-icon bg="black/20" aria-label="Close"
      hover:bg="black/40" dark:bg="white/30" dark:hover:bg="white/20"
      absolute top-0 right-0 m1 pointer-events-auto
      @click="emit('close')"
    >
      <div i-ri:close-fill text-white />
    </button>
  </div>
</template>
