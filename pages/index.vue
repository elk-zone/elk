<script setup lang="ts">
const client = useClient()
const posts = await client.getPublicTimeline()
</script>

<template>
  <div w-150>
    <template v-for="post in posts" :key="post.id">
      <PostCard :post="post" />
    </template>
  </div>
</template>
