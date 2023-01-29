<script setup lang="ts">
const { as = 'button', command, disabled, content, icon } = defineProps<{
  text?: string | number
  content: string
  color: string
  icon: string
  activeIcon?: string
  hover: string
  groupHover: string
  active?: boolean
  disabled?: boolean
  as?: string
  command?: boolean
}>()

defineOptions({
  inheritAttrs: false,
})

defineSlots<{
  text: {}
}>()

const el = ref<HTMLDivElement>()

useCommand({
  scope: 'Actions',

  order: -2,
  visible: () => command && !disabled,

  name: () => content,
  icon: () => icon,

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
    :class="active ? color : 'text-secondary'"
    :aria-label="content"
    :disabled="disabled"
  >
    <CommonTooltip placement="bottom" :content="content">
      <div
        rounded-full p2
        v-bind="disabled ? {} : {
          'group-hover': groupHover,
          'group-focus-visible': groupHover,
          'group-focus-visible:ring': '2 current',
        }"
      >
        <div :class="active && activeIcon ? activeIcon : icon" />
      </div>
    </CommonTooltip>

    <CommonAnimateNumber v-if="text !== undefined || $slots.text" :increased="active" text-sm>
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
