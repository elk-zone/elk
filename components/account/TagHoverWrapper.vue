<script setup lang="ts">
import type { mastodon } from 'masto'
import TagCard from '~/components/tag/TagCard.vue'
import { fetchTag } from '~/composables/cache'

type WatcherType = [tag?: mastodon.v1.Tag, tagName?: string, v?: boolean]

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  tag?: mastodon.v1.Tag
  tagName?: string
  disabled?: boolean
}>()

const hoverCard = ref()
const targetIsVisible = ref(false)
const tagName = ref<string | undefined>()
const tag = ref<mastodon.v1.Tag | null | undefined>(props.tag)

useIntersectionObserver(
  hoverCard,
  ([{ intersectionRatio }]) => {
    targetIsVisible.value = intersectionRatio > 0.1
  },
)

watch(
  () => [props.tag, props.tagName, targetIsVisible.value] satisfies WatcherType,
  ([newTag, newTagName, newVisible], oldProps) => {
    if (newTag) {
      tag.value = newTag
      return
    }

    if (!newVisible || process.test)
      return

    if (newTagName) {
      const [_oldTag, oldTagName, _oldVisible] = oldProps ?? [undefined, undefined, false]
      if (!oldTagName || newTagName !== oldTagName || !tag.value) {
        fetchTag(newTagName).then((t) => {
          if (newTagName === props.tagName)
            tag.value = t
        })
      }

      return
    }

    tagName.value = undefined
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
