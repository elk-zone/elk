<script lang="ts" setup>
const tabs = computed(() => [
  {
    name: 'all',
    display: 'All',
  },
  {
    name: 'people',
    display: 'People',
  },
  {
    name: 'status',
    display: 'Status',
  },
  {
    name: 'hashtags',
    display: 'Hashtags',
  },
])

const currentTab = ref('all')

watch(currentTab, () => console.log(currentTab.value))
</script>

<template>
  <CommonTabs :options="tabs" command :model-value="currentTab" />
</template>
