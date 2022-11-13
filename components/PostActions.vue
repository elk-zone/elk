<script setup lang="ts">
import type { Post } from '~/api-client/types'

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <div flex justify-between gap-4>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:chat-3-line />
      <span>{{ post.replies_count }}</span>
    </button>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:repeat-fill />
      <span>{{ post.reblogs_count }}</span>
    </button>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:heart-3-line />
      <span>{{ post.favourites_count }}</span>
    </button>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:more-2-fill />
    </button>
  </div>
</template>
