<script setup lang="ts">
import type { GiphyGif } from '~/composables/giphy'

const emit = defineEmits<{
  (e: 'select', gif: GiphyGif): void
}>()

const { trending, search, hasKey } = useGiphy()

const query = ref('')
const gifs = ref<GiphyGif[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const opened = ref(false)
const searchEl = ref<HTMLInputElement>()

async function load(q: string) {
  if (!hasKey) {
    error.value = 'GIPHY API key not configured (NUXT_PUBLIC_GIPHY_API_KEY).'
    return
  }
  loading.value = true
  error.value = null
  try {
    gifs.value = q.trim() ? await search(q) : await trending()
  }
  catch (e) {
    error.value = (e as Error).message
    gifs.value = []
  }
  finally {
    loading.value = false
  }
}

const debouncedLoad = useDebounceFn(load, 300)
watch(query, q => debouncedLoad(q))

function onShow() {
  opened.value = true
  if (gifs.value.length === 0)
    load('')
  nextTick(() => searchEl.value?.focus())
}

function onHide() {
  opened.value = false
}

function pick(gif: GiphyGif) {
  emit('select', gif)
}
</script>

<template>
  <VDropdown auto-boundary-max-size @apply-show="onShow" @apply-hide="onHide">
    <slot />
    <template #popper>
      <div w-80 max-w-90vw flex="~ col" gap-2 p-2>
        <input
          ref="searchEl"
          v-model="query"
          type="text"
          placeholder="Search GIFs"
          bg-card border="~ base" rounded-3 px-3 py-2 text-sm outline-none
          focus:border-primary
        >
        <div v-if="error" text-sm text-danger p-2>
          {{ error }}
        </div>
        <div v-else-if="loading && gifs.length === 0" text-sm text-secondary text-center py-6>
          Loading…
        </div>
        <div v-else-if="gifs.length === 0" text-sm text-secondary text-center py-6>
          No GIFs found.
        </div>
        <div v-else grid="~ cols-2 gap-2" max-h-96 overflow-y-auto>
          <button
            v-for="gif in gifs"
            :key="gif.id"
            type="button"
            aria-label="Insert GIF"
            rounded-2 overflow-hidden border-0 p-0 cursor-pointer bg-card relative
            class="gif-tile"
            :style="{ aspectRatio: `${gif.preview.width} / ${gif.preview.height}` }"
            @click="pick(gif)"
          >
            <img
              :src="gif.preview.url"
              :alt="gif.title"
              w-full h-full object-cover
              loading="lazy"
            >
          </button>
        </div>
        <div text-xs text-secondary text-center>
          Powered by GIPHY
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<style scoped>
.gif-tile:hover {
  outline: 2px solid var(--c-primary);
}
</style>
