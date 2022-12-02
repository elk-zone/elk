<script setup lang="ts">
const props = defineProps<{
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

const el = ref<HTMLDivElement>()

useCommand({
  scope: 'Actions',

  order: -2,
  visible: () => props.command && !props.disabled,

  name: () => props.content,
  icon: () => props.icon,

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
    :is="as || 'button'"
    v-bind="$attrs" ref="el"
    w-fit flex gap-1 items-center
    rounded group :hover="hover"
    focus:outline-none cursor-pointer
    :focus-visible="hover"
    :class="active ? [color] : 'text-secondary'"
    :aria-label="content"
  >
    <CommonTooltip placement="bottom" :content="content">
      <div rounded-full p2 :group-hover="groupHover" :group-focus-visible="groupHover" group-focus-visible:ring="2 current">
        <div :class="[active && activeIcon ? activeIcon : icon, { 'pointer-events-none': disabled }]" />
      </div>
    </CommonTooltip>

    <CommonAnimateNumber :increased="active" text-sm>
      <span text-secondary-light>{{ text }}</span>
      <template #next>
        <span :class="[color]">{{ text }}</span>
      </template>
    </CommonAnimateNumber>
  </component>
</template>
