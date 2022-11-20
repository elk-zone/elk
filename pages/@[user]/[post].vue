<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const id = computed(() => params.post as string)

const masto = await useMasto()
const { data: status } = await useAsyncData(`${id}-status`, () => masto.statuses.fetch(params.post as string))
const { data: context } = await useAsyncData(`${id}-context`, () => masto.statuses.fetchContext(params.post as string))
</script>

<template>
  <template v-for="comment of context?.ancestors" :key="comment.id">
    <StatusCard :status="comment" border="t border" pt-4 />
  </template>
  <StatusDetails :status="status" border="t border" pt-4 />
  <template v-for="comment of context?.descendants" :key="comment.id">
    <StatusCard :status="comment" pt-4 />
  </template>
</template>
