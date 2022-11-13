<script setup lang="ts">
import type { Post } from '~/api-client/types'

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <NuxtLink flex flex-col gap-2 my-4 :to="`/${post.account.acct}/${post.id}`">
    <AccountInfo :account="post.account" />
    <PostBody :post="post" />
    <PostActions :post="post" />
  </NuxtLink>
</template>
