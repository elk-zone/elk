<script setup lang="ts">
interface Role {
  name: string
  color: string
}

defineProps<{
  role: Role
}>()
</script>

<template>
  <div
    flex="~ gap1" items-center
    class="border border-base rounded-md px-1"
    text-secondary-light
  >
    <slot name="prepend" />
    <div :style="`color: ${role.color}; border-color: ${role.color}`">
      {{ role.name }}
    </div>
  </div>
</template>
