<script setup lang="ts">
const homeFilter = useHomeFilter()
</script>

<template>
  <VDropdown>
    <button btn-text>
      <div i-ri:filter-2-line />
    </button>

    <template #popper>
      <CommonCheckbox v-model="homeFilter.bot" label="post by bot" />
      <CommonCheckbox v-model="homeFilter.sensitive" label="post contains sensitive" />
      <CommonCheckbox v-model="homeFilter.repost" label="post is a repost" />
      <CommonCheckbox v-model="homeFilter.mutual" label="post is from a mutual" />
      <CommonCheckbox v-model="homeFilter.tag" label="post is from a tag I follow" />
    </template>
  </VDropdown>
</template>
