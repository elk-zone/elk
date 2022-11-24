<script setup lang="ts">
import { dropdownContextKey } from './ctx'

defineProps<{
  description?: string
  icon?: string
  checked?: boolean
}>()
const emit = defineEmits(['click'])

const { hide } = inject(dropdownContextKey)!

const handleClick = (evt: MouseEvent) => {
  hide()
  emit('click', evt)
}
</script>

<template>
  <div
    flex gap-3 items-center cursor-pointer px4 py3 hover-bg-active
    @click="handleClick"
  >
    <div v-if="icon" :class="icon" />
    <div flex="~ col">
      <div text-15px font-700>
        <slot />
      </div>
      <div text-3 text="gray/90">
        <slot name="description">
          <p v-if="description">
            {{ description }}
          </p>
        </slot>
      </div>
    </div>

    <div flex-auto />

    <div v-if="checked" i-ri:check-line />
  </div>
</template>
