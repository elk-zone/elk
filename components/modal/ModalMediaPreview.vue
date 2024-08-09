<script setup lang="ts">
const emit = defineEmits(['close'])

const locked = useScrollLock(document.body)

// Use to avoid strange error when directlying assigning to v-model on ModelMediaPreviewCarousel
const index = mediaPreviewIndex

const current = computed(() => mediaPreviewList.value[mediaPreviewIndex.value])
const hasNext = computed(() => index.value < mediaPreviewList.value.length - 1)
const hasPrev = computed(() => index.value > 0)

const keys = useMagicKeys()

whenever(keys.arrowLeft, prev)
whenever(keys.arrowRight, next)

function next() {
  if (hasNext.value)
    index.value++
}

function prev() {
  if (hasPrev.value)
    index.value--
}

function onClick(e: MouseEvent) {
  const path = e.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO', 'P'].includes(el.tagName?.toUpperCase()))
  if (!el)
    emit('close')
}

onMounted(() => locked.value = true)
onUnmounted(() => locked.value = false)
</script>

<template>
  <div relative h-full w-full flex pt-12 @click="onClick">
    <button
      v-if="hasNext" pointer-events-auto btn-action-icon bg="black/20" :aria-label="$t('action.next')"
      hover:bg="black/40" dark:bg="white/30" dark-hover:bg="white/20" absolute top="1/2" right-1 z5
      :title="$t('action.next')" @click="next"
    >
      <div i-ri:arrow-right-s-line text-white />
    </button>
    <button
      v-if="hasPrev" pointer-events-auto btn-action-icon bg="black/20" :aria-label="$t('action.prev')"
      hover:bg="black/40" dark:bg="white/30" dark:hover-bg="white/20" absolute top="1/2" left-1 z5
      :title="$t('action.prev')" @click="prev"
    >
      <div i-ri:arrow-left-s-line text-white />
    </button>

    <div flex="~ col center" h-full w-full>
      <ModalMediaPreviewCarousel v-model="index" :media="mediaPreviewList" @close="emit('close')" />

      <div bg="black/30" dark:bg="white/10" mb-6 mt-4 text-white rounded-full flex="~ center shrink-0" overflow-hidden>
        <div v-if="mediaPreviewList.length > 1" p="y-1 x-3" rounded-r-0 shrink-0>
          {{ index + 1 }} / {{ mediaPreviewList.length }}
        </div>
        <p
          v-if="current.description" bg="dark/30" dark:bg="white/10" p="y-1 x-3" rounded-ie-full line-clamp-1
          ws-pre-wrap break-all :title="current.description" w-full
        >
          {{ current.description }}
        </p>
      </div>
    </div>

    <div absolute top-0 w-full flex justify-end>
      <button
        btn-action-icon bg="black/30" :aria-label="$t('action.close')" hover:bg="black/40" dark:bg="white/30"
        dark:hover-bg="white/20" pointer-events-auto shrink-0 @click="emit('close')"
      >
        <div i-ri:close-line text-white />
      </button>
    </div>
  </div>
</template>
