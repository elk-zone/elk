<script setup lang="ts">
const homeFilter = useHomeFilter()

const isActive = $computed(() => {
  return !homeFilter.value.bot
      || !homeFilter.value.sensitive
      || !homeFilter.value.repost
      || !homeFilter.value.mutual
      || !homeFilter.value.tag
})
</script>

<template>
  <VDropdown>
    <button btn-text>
      <div :class="isActive ? 'i-ri:filter-2-fill' : 'i-ri:filter-2-line'" />
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
