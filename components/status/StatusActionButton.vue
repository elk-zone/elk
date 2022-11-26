<script setup lang="ts">
defineProps<{
  text?: string | number
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
    :is="as || 'button'"
    flex gap-1 items-center rounded group
    :hover="`op100 ${hover}`" focus:outline-none :focus-visible="`op100 ${hover}`"
    :class="active ? [color, 'op100'] : 'op50'"
    v-bind="$attrs"
  >
    <div rounded-full p2 :group-hover="groupHover" :group-focus-visible="groupHover" group-focus-visible:ring="2 current">
      <div :class="[active && activeIcon ? activeIcon : icon, { 'pointer-events-none': disabled }]" />
    </div>

    <span v-if="text">{{ text }}</span>
  </component>
</template>
