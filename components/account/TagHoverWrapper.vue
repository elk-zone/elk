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
const hovered = ref(false)

watch(hovered, () => {
  if (tagName) {
    fetchTag(tagName).then((t) => {
      tag.value = t
    })
  }
})

const userSettings = useUserSettings()
</script>

<template>
  <span @mouseenter="hovered = true">
    <VMenu
      v-if="!disabled && !getPreferences(userSettings, 'hideTagHoverCard')"
      placement="bottom-start"
      :delay="{ show: 500, hide: 100 }"
      v-bind="$attrs"
      :close-on-content-click="false"
    >
      <slot />
      <template #popper>
        <TagCard v-if="tag" :tag="tag" />
      </template>
    </VMenu>
    <slot v-else />
  </span>
</template>
