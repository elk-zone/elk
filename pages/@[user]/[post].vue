<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params

const masto = await useMasto()
const { data: status } = await useAsyncData(() => masto.statuses.fetch(params.post as string))
</script>

<template>
  <div w-130>
    <StatusCard :status="status" />
  </div>
</template>
