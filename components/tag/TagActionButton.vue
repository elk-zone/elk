<script setup lang="ts">
import type { Tag } from 'masto'

const { tag } = defineProps<{
  tag: Tag
}>()

const emit = defineEmits<{
  (event: 'change'): void
}>()

const { tags } = useMasto()

const toggleFollowTag = async () => {
  if (tag.following)
    await tags.unfollow(tag.name)
  else
    await tags.follow(tag.name)

  emit('change')
}
</script>

<template>
  <button
    rounded group focus:outline-none
    hover:text-primary focus-visible:text-primary
    @click="toggleFollowTag()"
  >
    <CommonTooltip placement="bottom" :content="tag.following ? 'Unfollow' : 'Follow'">
      <div rounded-full p2 group-hover="bg-orange/10" group-focus-visible="bg-orange/10" group-focus-visible:ring="2 current">
        <div :class="[tag.following ? 'i-ri:star-fill' : 'i-ri:star-line']" />
      </div>
    </CommonTooltip>
  </button>
</template>
