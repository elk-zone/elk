<script setup lang="ts">
import { dropdownContextKey } from './ctx'
defineProps<{
  placement?: string
}>()

const dropdown = $ref<any>()
const colorMode = useColorMode()

const hide = () => dropdown.hide()
provide(dropdownContextKey, {
  hide,
})

defineExpose({
  hide,
})
</script>

<template>
  <VDropdown v-bind="$attrs" ref="dropdown" :class="colorMode.value" :placement="placement || 'auto'">
    <slot />
    <template #popper="scope">
      <slot name="popper" v-bind="scope" />
    </template>
  </VDropdown>
</template>
