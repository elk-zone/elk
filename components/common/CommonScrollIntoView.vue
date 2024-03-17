<script setup lang="ts">
const { as = 'div', active } = defineProps<{
  as: any
  active: boolean
}>()

const el = ref()

watch(() => active, (active) => {
  const _el = unrefElement(el)

  if (active && _el)
    _el.scrollIntoView({ block: 'nearest', inline: 'start' })
})
</script>

<template>
  <component :is="as" ref="el">
    <slot />
  </component>
</template>
