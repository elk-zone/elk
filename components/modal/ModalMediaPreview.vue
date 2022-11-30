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
  <div relative h-screen w-screen flex select-none @click="onClick">
    <div absolute top-0 left-0 right-0 text-center>
      {{ mediaPreviewIndex + 1 }} / {{ mediaPreviewList.length }}
    </div>
    <button v-if="hasNext" btn-action-icon absolute top="1/2" right-1 title="Next" @click="next">
      <div i-ri:arrow-right-s-line />
    </button>
    <button v-if="hasPrev" btn-action-icon absolute top="1/2" left-1 title="Next" @click="prev">
      <div i-ri:arrow-left-s-line />
    </button>
    <img :src="current.url || current.previewUrl" :alt="current.description || ''" max-w-95vw max-h-95vh ma>
  </div>
</template>
