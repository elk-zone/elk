<script setup lang="ts">
import type { akkoma } from 'akko'

const { emoji, status } = defineProps<
  {
    emoji: akkoma.v1.CustomEmoji
    status: akkoma.v1.Status
  }
>()

const { toggleReact, toggleFavourite } = useStatusActions({ status })

const onClick = () => emoji.shortcode === '👍' ? toggleFavourite() : toggleReact(emoji.shortcode)
</script>

<template>
  <button class="hover:bg-purple/10 rounded-full p-1" @click="onClick">
    <img v-if="emoji.staticUrl" :src="emoji.staticUrl" :alt="emoji.shortcode" class="w-[25px] h-[25px]">
    <div v-else flex items-center class="w-[25px] h-[25px] text-[25px]">
      {{ emoji.shortcode }}
    </div>
  </button>
</template>
