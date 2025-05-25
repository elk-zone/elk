<script lang="ts" setup>
import type { akkoma } from '@bdxtown/akko'

const { toggleReact } = defineProps<
  {
    toggleReact: (emoji: akkoma.v1.CustomEmoji) => void
  }
>()

const shown = ref(false)

function reactEmoji(v: string) {
  toggleReact({
    shortcode: v,
    staticUrl: '',
    url: '',
    visibleInPicker: true,
  })
  shown.value = false
}

function reactCustomEmoji(v: { 'src': string, 'data-emoji-id': string }) {
  toggleReact({
    shortcode: v['data-emoji-id'],
    url: v.src,
    staticUrl: v.src,
    visibleInPicker: true,
  })
  shown.value = false
}

function toggle() {
  shown.value = !shown.value
}
</script>

<template>
  <EmojiPicker v-model="shown" @select="reactEmoji" @select-custom="reactCustomEmoji">
    <button class="hover:bg-purple/10 rounded-full p-1" @click="toggle()">
      <div flex items-center justify-center class="w-[25px] h-[25px] text-[25px]">
        ➕
      </div>
    </button>
  </EmojiPicker>
</template>
