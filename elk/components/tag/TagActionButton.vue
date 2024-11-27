<script setup lang="ts">
import type { akkoma } from 'akko'

const { tag } = defineProps<{
  tag: akkoma.v1.Tag
}>()

const emit = defineEmits<{
  (event: 'change'): void
}>()

const { client } = useAkko()

async function toggleFollowTag() {
  // We save the state so be can do an optimistic UI update, but fallback to the previous state if the API call fails
  const previousFollowingState = tag.following

  // eslint-disable-next-line vue/no-mutating-props
  tag.following = !tag.following

  try {
    if (previousFollowingState)
      await client.value.v1.tags.$select(tag.name).unfollow()
    else
      await client.value.v1.tags.$select(tag.name).follow()

    emit('change')
  }
  catch {
    // eslint-disable-next-line vue/no-mutating-props
    tag.following = previousFollowingState
  }
}
</script>

<template>
  <button
    rounded group focus:outline-none
    hover:text-primary focus-visible:text-primary
    :aria-label="tag.following ? $t('tag.unfollow_label', [tag.name]) : $t('tag.follow_label', [tag.name])"
    @click="toggleFollowTag()"
  >
    <CommonTooltip placement="bottom" :content="tag.following ? $t('tag.unfollow') : $t('tag.follow')">
      <div rounded-full p2 elk-group-hover="bg-orange/10" group-focus-visible="bg-orange/10" group-focus-visible:ring="2 current">
        <div :class="[tag.following ? 'i-ri:star-fill' : 'i-ri:star-line']" />
      </div>
    </CommonTooltip>
  </button>
</template>
