<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const { as = 'div', active, selected = undefined } = defineProps<{
  as?: string
  active: boolean
  to?: RouteLocationRaw
  selected?: HTMLAttributes['aria-selected']
  tabindex?: HTMLAttributes['tabindex']
}>()

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const el = ref()

watch(() => active, (active) => {
  const _el = unrefElement(el)

  if (active && _el)
    _el.scrollIntoView({ block: 'nearest', inline: 'start' })
})
</script>

<template>
  <component :is="as" ref="el" :to="to" :aria-selected="selected" :tabindex="tabindex" @click="emit('click', $event)">
    <slot />
  </component>
</template>
