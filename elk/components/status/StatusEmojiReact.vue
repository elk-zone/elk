<script setup lang="ts">
import type { akkoma } from 'akko'

defineOptions({
  inheritAttrs: false,
})

const { as = 'button', command, disabled, content, status } = defineProps<{
  status: akkoma.v1.Status
  text?: string | number
  content: string
  color: string
  hover: string
  elkGroupHover: string
  disabled?: boolean
  as?: string
  command?: boolean
}>()

defineSlots<{
  text: (props: object) => void
  icon: (props: object) => void
}>()

const el = ref<HTMLDivElement>()

useCommand({
  scope: 'Actions',

  order: -2,
  visible: () => command && !disabled,

  name: () => content,
  icon: () => '',

  onActivate() {
    if (!checkLogin())
      return
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    el.value?.dispatchEvent(clickEvent)
  },
})

const commonReacts = useEmojisFallback(() => ['👍', '❤️', '😆', '😮', '😢', '😩'].map(shortcode => ({ shortcode, staticUrl: '', url: '', visibleInPicker: true })))

const shown = ref(false)

function toggle() {
  console.log("toggle")
  shown.value = !shown.value
}
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs" ref="el"
    w-fit flex gap-1 items-center transition-all select-none
    rounded group
    :hover=" !disabled ? hover : undefined"
    focus:outline-none
    :focus-visible="hover"
    :class="`${disabled ? 'op25 cursor-not-allowed' : 'text-secondary'}`"
    :aria-label="content"
    :disabled="disabled"
    :aria-disabled="disabled"
  >
    <VDropdown v-model:shown="shown" placement="top" :triggers="[]">
      <div
        class="h-[33px]"
        rounded-full p2
        v-bind="disabled ? {} : {
          'elk-group-hover': elkGroupHover,
          'group-focus-visible': elkGroupHover,
          'group-focus-visible:ring': '2 current',
        }"
        @click="toggle"
      >
        <slot name="icon" />
      </div>

      <template #popper>
        <div flex gap-3 p-2>
          <StatusEmojiReactItem
            v-for="emoji in commonReacts"
            :key="emoji.shortcode"
            :status="status"
            :emoji="emoji"
            @click="toggle"
          />
        </div>
      </template>
    </VDropdown>

    <CommonAnimateNumber v-if="text !== undefined || $slots.text" text-sm>
      <span text-secondary-light>
        <slot name="text">{{ text }}</slot>
      </span>
      <template #next>
        <span :class="[color]">
          <slot name="text">{{ text }}</slot>
        </span>
      </template>
    </CommonAnimateNumber>
  </component>
</template>
