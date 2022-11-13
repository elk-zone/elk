<script setup lang="ts">
import type { Post } from '~/api-client/types'

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <div flex flex-col gap-4 mb-5>
    <AccountInfo :account="post.account" />
    <div v-html="post.content" />
    <PostActions :post="post" />
  </div>
</template>
