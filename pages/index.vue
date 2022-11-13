<script setup lang="ts">
const client = useClient()
const { data: posts } = await useAsyncData(() => client.getPublicTimeline())
</script>

<template>
  <div w-150>
    <template v-for="post in posts" :key="post.id">
      <PostCard :post="post" border="t gray/10" pt-4 />
    </template>
  </div>
</template>
