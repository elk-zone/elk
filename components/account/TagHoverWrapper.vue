<script setup lang="ts">
import TagCard from '~/components/tag/TagCard.vue'

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
const tagName = ref<string | undefined>()

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
      tagName.value = newTagName
      return
    }

    if (!newVisible)
      return

    tagName.value = undefined
  }, { immediate: true, flush: 'post' },
)

const userSettings = useUserSettings()
</script>

<template>
  <span ref="hoverCard">
    <VMenu v-if="!disabled && tagName && !getPreferences(userSettings, 'hideAccountAndTagHoverCard')" placement="bottom-start" :delay="{ show: 500, hide: 100 }" v-bind="$attrs" :close-on-content-click="false">
      <slot />
      <template #popper>
        <TagCard v-if="tagName" :tag-name="tagName" />
      </template>
    </VMenu>
    <slot v-else />
  </span>
</template>
