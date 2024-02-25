<script setup lang="ts">
import type { mastodon } from 'masto'
import TagCard from '~/components/tag/TagCard.vue'
import { fetchTag } from '~/composables/cache'

type WatcherType = [tagName?: string, v?: boolean]

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  tagName?: string
  disabled?: boolean
}>()

const hoverCard = ref()
const targetIsVisible = ref(false)
const tag = ref<mastodon.v1.Tag | undefined>()

useIntersectionObserver(
  hoverCard,
  ([{ intersectionRatio }]) => {
    targetIsVisible.value = intersectionRatio <= 0.75
  },
)
watch(
  () => [props.tagName, targetIsVisible.value] satisfies WatcherType,
  async ([newTagName, newVisible]) => {
    if (newTagName) {
      tag.value = await fetchTag(newTagName)
      return
    }

    if (!newVisible)
      return

    tag.value = undefined
  }, { immediate: true, flush: 'post' },
)

const userSettings = useUserSettings()
</script>

<template>
  <span ref="hoverCard">
    <VMenu v-if="!disabled && tag && !getPreferences(userSettings, 'hideAccountAndTagHoverCard')" placement="bottom-start" :delay="{ show: 500, hide: 100 }" v-bind="$attrs" :close-on-content-click="false">
      <slot />
      <template #popper>
        <TagCard v-if="tag" :tag="tag" />
      </template>
    </VMenu>
    <slot v-else />
  </span>
</template>
