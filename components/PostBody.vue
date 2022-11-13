<script setup lang="ts">
import type { Post } from '~/api-client/types'

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <div class="post-body" v-html="sanitize(post.content)" />
</template>

<style>
.post-body a {
  --at-apply: text-primary hover:underline;
}
.post-body b {
  --at-apply: font-bold;
}
.post-body p {
  --at-apply: my-1;
}
.post-body a .invisible {
  --at-apply: hidden;
}
.post-body a .ellipsis {
  --at-apply: truncate overflow-hidden ws-nowrap;
}
</style>
