<script setup lang="ts">
import type { mastodon } from 'masto'

defineOptions({
  inheritAttrs: false,
})

const { tagName, disabled } = defineProps<{
  tagName?: string
  disabled?: boolean
}>()

const tag = ref<mastodon.v1.Tag>()
const tagHover = ref()
const hovered = useElementHover(tagHover)

watch(hovered, (newHovered) => {
  if (newHovered && tagName) {
    fetchTag(tagName).then((t) => {
      tag.value = t
    })
  }
})

const userSettings = useUserSettings()
</script>

<template>
  <span ref="tagHover">
    <VMenu
      v-if="!disabled && !getPreferences(userSettings, 'hideTagHoverCard')"
      placement="bottom-start"
      :delay="{ show: 500, hide: 100 }"
      v-bind="$attrs"
      :close-on-content-click="false"
      no-auto-focus
    >
      <slot />
      <template #popper>
        <TagCardSkeleton v-if="!tag" />
        <TagCard v-else :tag="tag" />
      </template>
    </VMenu>
    <slot v-else />
  </span>
</template>
