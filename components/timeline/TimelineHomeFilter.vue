<script setup lang="ts">
const filter = ref({
  bot: true,
  sensitive: true,
  repost: true,
  mutual: true,
  tag: true,
})
</script>

<template>
  <VDropdown>
    <button btn-text>
      <div i-ri:filter-2-line />
    </button>

    <template #popper>
      <CommonCheckbox v-model="filter.bot" label="post by bot" />
      <CommonCheckbox v-model="filter.sensitive" label="post contains sensitive" />
      <CommonCheckbox v-model="filter.repost" label="post is a repost" />
      <CommonCheckbox v-model="filter.mutual" label="post is from a mutual" />
      <CommonCheckbox v-model="filter.tag" label="post is from a tag I follow" />
    </template>
  </VDropdown>
</template>
