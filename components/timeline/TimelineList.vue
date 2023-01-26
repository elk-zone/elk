<script setup lang="ts">
const paginator = useMastoClient().v1.lists.list()
const items = $(usePaginator(paginator, $$(undefined)).items)

const tabs = $computed(() => items.map((item) => {
  return {
    to: isHydrated.value ? `/${currentServer.value}/${item.id}` : '',
    display: isHydrated.value ? item.title : '',
  }
}))
</script>

<template>
  <CommonRouteTabs force replace :options="tabs" />
</template>
