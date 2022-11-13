<script setup lang="ts">
import type { Post } from '~/api-client/types'

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <div flex justify-around px-2>
    <button flex gap-1 items-center>
      <div i-ri:chat-3-line />
      <span>{{ post.replies_count }}</span>
    </button>
    <button flex gap-1 items-center>
      <div i-ri:repeat-fill />
      <span>{{ post.reblogs_count }}</span>
    </button>
    <button flex gap-1 items-center>
      <div i-ri:heart-3-line />
      <span>{{ post.favourites_count }}</span>
    </button>
  </div>
</template>
