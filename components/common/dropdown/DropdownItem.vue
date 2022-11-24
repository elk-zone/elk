<script setup lang="ts">
import { dropdownContextKey } from './ctx'

defineProps<{
  icon?: string
}>()
const emit = defineEmits(['click'])

const { hide } = inject(dropdownContextKey)!

const handleClick = (evt: MouseEvent) => {
  hide()
  emit('click', evt)
}
</script>

<template>
  <div flex gap-2 items-center cursor-pointer px4 py3 font-700 hover="bg-active" @click="handleClick">
    <div v-if="icon" :class="icon" />
    <span text-15px><slot /></span>
  </div>
</template>
