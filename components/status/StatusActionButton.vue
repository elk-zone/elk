<script setup lang="ts">
defineProps<{
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
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <component
    :is="as || 'button'" w-fit
    flex gap-1 items-center rounded group
    :hover="hover" focus:outline-none :focus-visible="hover"
    :class="active ? [color] : 'text-secondary'"
    v-bind="$attrs"
  >
    <CommonTooltip placement="bottom" :content="content">
      <div rounded-full p2 :group-hover="groupHover" :group-focus-visible="groupHover" group-focus-visible:ring="2 current">
        <div :class="[active && activeIcon ? activeIcon : icon, { 'pointer-events-none': disabled }]" />
      </div>
    </CommonTooltip>

    <span v-if="text" :class="active ? [color] : 'text-secondary-light'" text-sm>{{ text }}</span>
  </component>
</template>
