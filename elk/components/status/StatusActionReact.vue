<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

defineOptions({
  inheritAttrs: false,
})

const { isLoading, status } = defineProps<{
  as?: string
  status: akkoma.v1.Status
  isLoading: { favourited: boolean }
  toggleReact: (emoji: akkoma.v1.CustomEmoji) => void
}>()

const disabled = computed(() => isLoading.favourited)

const commonReacts = computed(() => ['👍', '❤️', '😆', '😮', '😢', '😩'].map(shortcode => ({ shortcode, staticUrl: '', url: '', visibleInPicker: true })))

const shown = ref(false)

function toggle() {
  shown.value = !shown.value
}

const reactionCount = computed(() => status.pleroma.emojiReactions.reduce((acc, curr) => acc += curr.count, status.favouritesCount))

const reaction = computed(() => {
  const reactions = status.favourited ? [{ shortcode: '👍', url: '', staticUrl: '', visibleInPicker: true }] : status.pleroma.emojiReactions.filter(react => react.me).map(r => ({ shortcode: r.name, url: r.url as string, staticUrl: r.url as string, visibleInPicker: true }))
  if (reactions.length > 0)
    return reactions[0]
  return undefined
})

const active = computed(() => !!(status.favourited || status.pleroma.emojiReactions?.find(r => r.me)))
</script>

<template>
  <button
    w-fit flex gap-1 items-center transition-all select-none
    rounded group
    :hover=" !disabled ? 'text-purple' : undefined"
    focus:outline-none
    focus-visible="text-purple"
    :class="`${disabled ? 'op25 cursor-not-allowed' : 'text-secondary'}`"
    :aria-label="$t(reaction ? 'action.favourited' : 'action.favourite')"
    :aria-disabled="disabled"
  >
    <VDropdown v-model:shown="shown" placement="top" :triggers="[]">
      <div
        class="h-[33px]"
        rounded-full p2
        :elk-group-hover="disabled ? undefined : 'bg-purple/10'"
        :group-focus-visible="disabled ? undefined : 'bg-purple/10'"
        :group-focus-visible:ring="disabled ? undefined : '2 current'"
        @click="toggle"
      >
        <div v-if="!reaction" class="i-ri:thumb-up-line" />
        <img v-else-if="reaction.staticUrl" :src="reaction.staticUrl" :alt="reaction.shortcode" class="w-[18px] h-[18px] leading-[18px]">
        <div v-else class="text-[16px] leading-[18px]">
          {{ reaction.shortcode }}
        </div>
      </div>

      <template #popper>
        <div flex gap-3 p-2>
          <StatusEmojiReactItem
            v-for="emoji in commonReacts"
            :key="emoji.shortcode"
            :emoji="emoji"
            :toggle-react="toggleReact"
            @click="toggle"
          />
          <StatusEmojiCustomReactItem
            :toggle-react="toggleReact"
            @click="toggle"
          />
        </div>
      </template>
    </VDropdown>

    <CommonAnimateNumber text-sm :increased="active">
      <span text-secondary-light>
        <slot name="text">{{ reactionCount || '' }}</slot>
      </span>
      <template #next>
        <span class="text-secondary">
          <slot name="text">{{ reactionCount || '' }}</slot>
        </span>
      </template>
    </CommonAnimateNumber>
  </button>
</template>
