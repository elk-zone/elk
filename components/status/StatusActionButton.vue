<script setup lang="ts">
defineProps<{
  text?: string | number
  color: string
  icon: string
  activeIcon: string
  tooltip: string
  hover: string
  groupHover: string
  active?: boolean
  disabled?: boolean
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <CommonTooltip placement="bottom">
    <button
      flex gap-1 items-center rounded :hover="`op100 ${hover}`" group
      :class="active ? [color, 'op100'] : 'op50'"
      v-bind="$attrs"
    >
      <div rounded-full p2 :group-hover="groupHover">
        <div :class="[active && activeIcon ? activeIcon : icon, { 'pointer-events-none': disabled }]" />
      </div>

      <span v-if="text">{{ text }}</span>
    </button>

    <template #popper>
      {{ tooltip }}
    </template>
  </CommonTooltip>
</template>
