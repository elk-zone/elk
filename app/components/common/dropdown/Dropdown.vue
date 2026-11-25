<script setup lang="ts">
import type { Placement } from 'floating-vue'
import { InjectionKeyDropdownContext } from '~/constants/symbols'

defineProps<{
  placement?: Placement
  autoBoundaryMaxSize?: boolean
}>()

const dropdown = ref<any>()
const colorMode = useColorMode()

function hide() {
  return dropdown.value.hide()
}
provide(InjectionKeyDropdownContext, {
  hide,
})

defineExpose({
  hide,
})
</script>

<template>
  <VDropdown v-bind="$attrs" ref="dropdown" :class="colorMode.value" :placement="placement || 'auto'" :auto-boundary-max-size="autoBoundaryMaxSize">
    <slot />
    <template #popper="scope">
      <slot name="popper" v-bind="scope" />
    </template>
  </VDropdown>
</template>
