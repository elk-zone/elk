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
      <CommonCheckbox v-model="homeFilter.bot" :label="$t('timeline.filter.include_bot')" />
      <CommonCheckbox v-model="homeFilter.sensitive" :label="$t('timeline.filter.include_sensitive')" />
      <CommonCheckbox v-model="homeFilter.repost" :label="$t('timeline.filter.include_repost')" />
      <CommonCheckbox v-model="homeFilter.mutual" :label="$t('timeline.filter.include_mutual')" />
      <CommonCheckbox v-model="homeFilter.tag" :label="$t('timeline.filter.include_tag')" />
    </template>
  </VDropdown>
</template>
