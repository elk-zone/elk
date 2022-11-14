<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
</script>

<template>
  <div>
    {{ params }}
  </div>
</template>
