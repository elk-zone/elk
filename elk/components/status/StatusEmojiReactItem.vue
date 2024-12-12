<script setup lang="ts">
import type { akkoma } from 'akko'

const { emoji, toggleReact } = defineProps<
  {
    emoji: akkoma.v1.CustomEmoji
    toggleReact: (e: string) => void
  }
>()

const onClick = () => toggleReact(emoji.shortcode)

const el = ref<HTMLButtonElement>()

useCommand({
  scope: 'Actions',

  order: -2,
  visible: () => true,

  name: () => emoji.shortcode,
  icon: () => emoji.shortcode,

  onActivate() {
    if (!checkLogin())
      return
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    el.value?.dispatchEvent(clickEvent)
  },
})
</script>

<template>
  <button ref="el" class="hover:bg-purple/10 rounded-full p-1" @click="onClick">
    <img v-if="emoji.staticUrl" :src="emoji.staticUrl" :alt="emoji.shortcode" class="w-[25px] h-[25px]">
    <div v-else flex items-center class="w-[25px] h-[25px] text-[25px]">
      {{ emoji.shortcode }}
    </div>
  </button>
</template>
