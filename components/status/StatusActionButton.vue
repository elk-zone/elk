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
    focus:outline-none
    :focus-visible="hover"
    :class="active ? [color] : 'text-secondary'"
  >
    <CommonTooltip placement="bottom" :content="content">
      <div rounded-full p2 :group-hover="groupHover" :group-focus-visible="groupHover" group-focus-visible:ring="2 current">
        <div :class="[active && activeIcon ? activeIcon : icon, { 'pointer-events-none': disabled }]" />
      </div>
    </CommonTooltip>

    <CommonAnimateNumber :increased="active">
      <span v-if="text" display-block :class="active ? [color] : 'text-secondary-light'" text-sm>{{ text ?? 0 }}</span>
      <template #next>
        <span v-if="text" display-block :class="active ? [color] : 'text-secondary-light'" text-sm>{{ text }}</span>
      </template>
    </CommonAnimateNumber>
  </component>
</template>
